// import express from 'express';
// import Poem from '../models/Poem.js';
// import { protect } from '../middleware/auth.js';
// import { sendNewPoemNotification } from '../services/emailService.js';

// const router = express.Router();

// router.get('/published', async (req, res) => {
//   try {
//     const poems = await Poem.find({ published: true }).sort({ createdAt: -1 });
//     res.json(poems);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// router.get('/', protect, async (req, res) => {
//   try {
//     const poems = await Poem.find({}).sort({ createdAt: -1 });
//     res.json(poems);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// router.post('/', protect, async (req, res) => {
//   try {
//     const { title, content, mood, published } = req.body;
//     if (!title || !content) {
//       return res.status(400).json({ message: 'Title and content are required' });
//     }

//     const poem = new Poem({ title, content, mood, published });
//     const createdPoem = await poem.save();

//     if (createdPoem.published) {
//       sendNewPoemNotification(createdPoem);
//     }

//     res.status(201).json(createdPoem);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// router.put('/:id', protect, async (req, res) => {
//   try {
//     const { title, content, mood, published } = req.body;
//     const poem = await Poem.findById(req.params.id);

//     if (poem) {
//       const wasAlreadyPublished = poem.published;

//       poem.title = title || poem.title;
//       poem.content = content || poem.content;
//       poem.mood = mood || poem.mood;
//       if (published !== undefined) {
//         poem.published = published;
//       }

//       const updatedPoem = await poem.save();

//       if (!wasAlreadyPublished && updatedPoem.published) {
//         sendNewPoemNotification(updatedPoem);
//       }

//       res.json(updatedPoem);
//     } else {
//       res.status(404).json({ message: 'Poem not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// router.delete('/:id', protect, async (req, res) => {
//     try {
//       const poem = await Poem.findById(req.params.id);

//       if (poem) {
//         await Poem.deleteOne({ _id: req.params.id });
//         res.json({ message: 'Poem removed successfully' });
//       } else {
//         res.status(404).json({ message: 'Poem not found' });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   });

// export default router;

// newly added code from claude

import express from "express";
import Subscriber from "../models/Subscriber.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC ROUTE - Subscribe to newsletter (no authentication required)
router.post("/subscribe", async (req, res) => {
  console.log("\n--- SUBSCRIBE REQUEST RECEIVED ---");
  console.log("Request body:", req.body);

  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      console.log("❌ No email provided");
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({
      email: email.toLowerCase(),
    });

    if (existingSubscriber) {
      console.log(`⚠️  Email already subscribed: ${email}`);
      return res.status(400).json({
        message: "This email is already subscribed to our newsletter!",
      });
    }

    // Create new subscriber
    const subscriber = new Subscriber({ email });
    const savedSubscriber = await subscriber.save();

    console.log(`✅ New subscriber added: ${savedSubscriber.email}`);
    console.log("--- SUBSCRIBE REQUEST COMPLETE ---\n");

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to the newsletter! 🎉",
      subscriber: {
        email: savedSubscriber.email,
        subscribedAt: savedSubscriber.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Error in subscribe route:", error);

    // Handle duplicate email error from MongoDB
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This email is already subscribed!",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to subscribe. Please try again later.",
    });
  }
});

// PUBLIC ROUTE - Unsubscribe from newsletter (no authentication required)
router.post("/unsubscribe", async (req, res) => {
  console.log("\n--- UNSUBSCRIBE REQUEST RECEIVED ---");

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const subscriber = await Subscriber.findOneAndDelete({
      email: email.toLowerCase(),
    });

    if (!subscriber) {
      console.log(`⚠️  Email not found: ${email}`);
      return res.status(404).json({
        message: "Email not found in our subscriber list",
      });
    }

    console.log(`✅ Subscriber removed: ${subscriber.email}`);
    console.log("--- UNSUBSCRIBE REQUEST COMPLETE ---\n");

    res.json({
      success: true,
      message: "Successfully unsubscribed from the newsletter.",
    });
  } catch (error) {
    console.error("❌ Error in unsubscribe route:", error);
    res.status(500).json({
      message: "Failed to unsubscribe. Please try again later.",
    });
  }
});

// PROTECTED ROUTE - Get all subscribers (admin only)
router.get("/", protect, async (req, res) => {
  console.log("\n--- GET ALL SUBSCRIBERS (ADMIN) ---");

  try {
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });

    console.log(`✅ Retrieved ${subscribers.length} subscribers`);

    res.json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    console.error("❌ Error fetching subscribers:", error);
    res.status(500).json({
      message: "Failed to fetch subscribers",
    });
  }
});

// PROTECTED ROUTE - Delete a subscriber (admin only)
router.delete("/:id", protect, async (req, res) => {
  console.log("\n--- DELETE SUBSCRIBER (ADMIN) ---");

  try {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        message: "Subscriber not found",
      });
    }

    await Subscriber.deleteOne({ _id: req.params.id });

    console.log(`✅ Subscriber deleted: ${subscriber.email}`);

    res.json({
      success: true,
      message: "Subscriber deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting subscriber:", error);
    res.status(500).json({
      message: "Failed to delete subscriber",
    });
  }
});

// PROTECTED ROUTE - Get subscriber count (admin only)
router.get("/count", protect, async (req, res) => {
  try {
    const count = await Subscriber.countDocuments();

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("❌ Error getting subscriber count:", error);
    res.status(500).json({
      message: "Failed to get subscriber count",
    });
  }
});

export default router;
