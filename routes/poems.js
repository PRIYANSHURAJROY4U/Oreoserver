// import express from "express";
// import Poem from "../models/Poem.js";
// import { authRequired } from "../middleware/auth.js";
// import validator from "validator";

// const router = express.Router();

// // Public: get published poems (for home page)
// router.get("/public", async (req, res) => {
//   const poems = await Poem.find({ published: true }).sort({ createdAt: -1 }).lean();
//   res.json(poems);
// });

// // Protected: get all poems (admin)
// router.get("/", authRequired, async (req, res) => {
//   const poems = await Poem.find({}).sort({ createdAt: -1 }).lean();
//   res.json(poems);
// });

// // Protected: add poem
// router.post("/", authRequired, async (req, res) => {
//   const { title, content, mood = "dreamy", published = false } = req.body;
//   if (!title || !content) return res.status(400).json({ message: "Missing fields" });
//   // sanitize lightly
//   const cleanTitle = validator.escape(String(title));
//   const cleanContent = String(content);
//   const preview = cleanContent.split("\n")[0].slice(0, 200);
//   const poem = await Poem.create({
//     title: cleanTitle,
//     content: cleanContent,
//     preview,
//     mood,
//     published,
//     author: req.user.username,
//   });
//   res.json(poem);
// });

// // Protected: update poem
// router.put("/:id", authRequired, async (req, res) => {
//   const { id } = req.params;
//   const update = req.body;
//   if (update.title) update.title = validator.escape(String(update.title));
//   if (update.content) update.preview = update.content.split("\n")[0].slice(0, 200);
//   const p = await Poem.findByIdAndUpdate(id, update, { new: true });
//   res.json(p);
// });

// // Protected: delete poem
// router.delete("/:id", authRequired, async (req, res) => {
//   await Poem.findByIdAndDelete(req.params.id);
//   res.json({ ok: true });
// });

// export default router;

// new code with api integ:

// const express = require('express');
// const Poem = require('../models/Poem');
// const { requireAuth, optionalAuth } = require('../middleware/auth');

// const router = express.Router();

// // Get all published poems (public route)
// router.get('/published', optionalAuth, async (req, res) => {
//   try {
//     const poems = await Poem.find({ published: true })
//       .sort({ publishedAt: -1, createdAt: -1 })
//       .select('-__v')
//       .lean();

//     res.json(poems);
//   } catch (error) {
//     console.error('Get published poems error:', error);
//     res.status(500).json({
//       message: 'Failed to fetch published poems'
//     });
//   }
// });

// // Get all poems for authenticated user (admin route)
// router.get('/', requireAuth, async (req, res) => {
//   try {
//     const poems = await Poem.find({ authorId: req.user._id })
//       .sort({ createdAt: -1 })
//       .select('-__v')
//       .lean();

//     res.json(poems);
//   } catch (error) {
//     console.error('Get user poems error:', error);
//     res.status(500).json({
//       message: 'Failed to fetch poems'
//     });
//   }
// });

// // Get single poem by ID
// router.get('/:id', optionalAuth, async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Build query - if not authenticated, only show published poems
//     const query = { _id: id };
//     if (!req.user) {
//       query.published = true;
//     } else {
//       // If authenticated, show all poems by this user or published poems by others
//       query.$or = [
//         { authorId: req.user._id },
//         { published: true }
//       ];
//     }

//     const poem = await Poem.findOne(query).select('-__v').lean();

//     if (!poem) {
//       return res.status(404).json({
//         message: 'Poem not found'
//       });
//     }

//     // Increment view count (optional)
//     await Poem.findByIdAndUpdate(id, { $inc: { views: 1 } });

//     res.json(poem);
//   } catch (error) {
//     console.error('Get poem error:', error);
//     res.status(500).json({
//       message: 'Failed to fetch poem'
//     });
//   }
// });

// // Create new poem
// router.post('/', requireAuth, async (req, res) => {
//   try {
//     const { title, content, mood, published, author, tags } = req.body;

//     // Validation
//     if (!title || !content) {
//       return res.status(400).json({
//         message: 'Title and content are required'
//       });
//     }

//     if (title.length > 200) {
//       return res.status(400).json({
//         message: 'Title cannot exceed 200 characters'
//       });
//     }

//     if (content.length < 10) {
//       return res.status(400).json({
//         message: 'Content must be at least 10 characters long'
//       });
//     }

//     // Create poem
//     const poem = new Poem({
//       title: title.trim(),
//       content: content.trim(),
//       mood: mood || 'dreamy',
//       published: published || false,
//       author: author || req.user.username || '@oreongutan // @oftoreo',
//       authorId: req.user._id,
//       tags: tags || []
//     });

//     // Generate preview if not provided
//     if (!poem.preview) {
//       const firstLine = content.split('\n')[0];
//       poem.preview = firstLine.length > 80
//         ? firstLine.substring(0, 80) + '...'
//         : firstLine + (content.includes('\n') ? '...' : '');
//     }

//     await poem.save();

//     res.status(201).json({
//       message: 'Poem created successfully',
//       poem
//     });

//   } catch (error) {
//     console.error('Create poem error:', error);

//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         message: 'Validation failed',
//         errors
//       });
//     }

//     res.status(500).json({
//       message: 'Failed to create poem'
//     });
//   }
// });

// // Update poem
// router.put('/:id', requireAuth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, content, mood, published, author, tags } = req.body;

//     // Find poem
//     const poem = await Poem.findOne({
//       _id: id,
//       authorId: req.user._id
//     });

//     if (!poem) {
//       return res.status(404).json({
//         message: 'Poem not found or you do not have permission to edit it'
//       });
//     }

//     // Validation
//     if (title && title.length > 200) {
//       return res.status(400).json({
//         message: 'Title cannot exceed 200 characters'
//       });
//     }

//     if (content && content.length < 10) {
//       return res.status(400).json({
//         message: 'Content must be at least 10 characters long'
//       });
//     }

//     // Update fields
//     if (title !== undefined) poem.title = title.trim();
//     if (content !== undefined) {
//       poem.content = content.trim();
//       // Regenerate preview when content changes
//       const firstLine = content.split('\n')[0];
//       poem.preview = firstLine.length > 80
//         ? firstLine.substring(0, 80) + '...'
//         : firstLine + (content.includes('\n') ? '...' : '');
//     }
//     if (mood !== undefined) poem.mood = mood;
//     if (published !== undefined) {
//       poem.published = published;
//       // Set publishedAt timestamp when published for first time
//       if (published && !poem.publishedAt) {
//         poem.publishedAt = new Date();
//       }
//     }
//     if (author !== undefined) poem.author = author;
//     if (tags !== undefined) poem.tags = tags;

//     await poem.save();

//     res.json({
//       message: 'Poem updated successfully',
//       poem
//     });

//   } catch (error) {
//     console.error('Update poem error:', error);

//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         message: 'Validation failed',
//         errors
//       });
//     }

//     res.status(500).json({
//       message: 'Failed to update poem'
//     });
//   }
// });

// // Delete poem
// router.delete('/:id', requireAuth, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const poem = await Poem.findOneAndDelete({
//       _id: id,
//       authorId: req.user._id
//     });

//     if (!poem) {
//       return res.status(404).json({
//         message: 'Poem not found or you do not have permission to delete it'
//       });
//     }

//     res.json({
//       message: 'Poem deleted successfully'
//     });

//   } catch (error) {
//     console.error('Delete poem error:', error);
//     res.status(500).json({
//       message: 'Failed to delete poem'
//     });
//   }
// });

// // Toggle like on poem (public route with optional auth)
// router.post('/:id/like', optionalAuth, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const poem = await Poem.findById(id);
//     if (!poem) {
//       return res.status(404).json({
//         message: 'Poem not found'
//       });
//     }

//     // For now, just increment likes (you can implement user-specific likes later)
//     poem.likes += 1;
//     await poem.save();

//     res.json({
//       message: 'Poem liked successfully',
//       likes: poem.likes
//     });

//   } catch (error) {
//     console.error('Like poem error:', error);
//     res.status(500).json({
//       message: 'Failed to like poem'
//     });
//   }
// });

// // Search poems
// router.get('/search/:query', optionalAuth, async (req, res) => {
//   try {
//     const { query } = req.params;
//     const { mood, published } = req.query;

//     // Build search criteria
//     const searchCriteria = {
//       $text: { $search: query }
//     };

//     // Add filters
//     if (mood) searchCriteria.mood = mood;
//     if (published !== undefined) searchCriteria.published = published === 'true';

//     // If not authenticated, only show published poems
//     if (!req.user) {
//       searchCriteria.published = true;
//     }

//     const poems = await Poem.find(searchCriteria)
//       .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
//       .select('-__v')
//       .lean();

//     res.json({
//       query,
//       results: poems,
//       count: poems.length
//     });

//   } catch (error) {
//     console.error('Search poems error:', error);
//     res.status(500).json({
//       message: 'Search failed'
//     });
//   }
// });

// // Get poems by mood
// router.get('/mood/:mood', optionalAuth, async (req, res) => {
//   try {
//     const { mood } = req.params;

//     const validMoods = ['dreamy', 'romantic', 'whimsical', 'ethereal', 'magical', 'mystical'];
//     if (!validMoods.includes(mood)) {
//       return res.status(400).json({
//         message: 'Invalid mood. Valid moods are: ' + validMoods.join(', ')
//       });
//     }

//     // Build query
//     const query = { mood };
//     if (!req.user) {
//       query.published = true;
//     }

//     const poems = await Poem.find(query)
//       .sort({ createdAt: -1 })
//       .select('-__v')
//       .lean();

//     res.json({
//       mood,
//       poems,
//       count: poems.length
//     });

//   } catch (error) {
//     console.error('Get poems by mood error:', error);
//     res.status(500).json({
//       message: 'Failed to fetch poems by mood'
//     });
//   }
// });

// module.exports = router;

// #3rd try/

// import express from "express";
// import Poem from "../models/Poem.js";
// import { protect } from "../middleware/auth.js";

// const router = express.Router();

// /**
//  * @desc    Get all PUBLISHED poems
//  * @route   GET /api/poems/published
//  * @access  Public
//  */
// router.get("/published", async (req, res) => {
//   try {
//     const poems = await Poem.find({ published: true }).sort({ createdAt: -1 });
//     res.json(poems);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// /**
//  * @desc    Get ALL poems (published and drafts for admin)
//  * @route   GET /api/poems
//  * @access  Private
//  */
// router.get("/", protect, async (req, res) => {
//   try {
//     const poems = await Poem.find({}).sort({ createdAt: -1 });
//     res.json(poems);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// /**
//  * @desc    Create a new poem
//  * @route   POST /api/poems
//  * @access  Private
//  */
// router.post("/", protect, async (req, res) => {
//   try {
//     const { title, content, mood, published } = req.body;

//     //    console.log('--- CREATE POEM ROUTE ---');
//     // console.log('Received "published" status from frontend:', published);
//     // console.log('--- END CREATE POEM ROUTE ---');
//          console.log('--- FORCED TEST: IGNORING FRONTEND "published" STATUS ---');

//     if (!title || !content) {
//       return res
//         .status(400)
//         .json({ message: "Title and content are required" });
//     }

//     const poem = new Poem({
//       title,
//       content,
//       mood,
//       published:true
//       // author: req.user.username, // Username from JWT payload via middleware
//     });

//     const createdPoem = await poem.save();

//      console.log('--- DATABASE RESPONSE ---');
//     console.log('Value of createdPoem.published IS:', createdPoem.published);
//     console.log('--- END DATABASE RESPONSE ---');

//     res.status(201).json(createdPoem);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// /**
//  * @desc    Update an existing poem
//  * @route   PUT /api/poems/:id
//  * @access  Private
//  */
// router.put("/:id", protect, async (req, res) => {
//   try {
//     const { title, content, mood, published } = req.body;
//     const poem = await Poem.findById(req.params.id);

//     if (poem) {
//       poem.title = title || poem.title;
//       poem.content = content || poem.content;
//       poem.mood = mood || poem.mood;
//       if (published !== undefined) {
//         poem.published = published;
//       }

//       const updatedPoem = await poem.save();
//       console.log('--- UPDATE POEM ROUTE ---');
//       console.log('Status BEFORE update (wasAlreadyPublished):', wasAlreadyPublished);
//       console.log('Status AFTER update (updatedPoem.published):', updatedPoem.published);
//       console.log('--- END UPDATE POEM ROUTE ---');
//       res.json(updatedPoem);
//     } else {
//       res.status(404).json({ message: "Poem not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// /**
//  * @desc    Delete a poem
//  * @route   DELETE /api/poems/:id
//  * @access  Private
//  */
// router.delete("/:id", protect, async (req, res) => {
//   try {
//     const poem = await Poem.findById(req.params.id);

//     if (poem) {
//       await Poem.deleteOne({ _id: req.params.id });
//       res.json({ message: "Poem removed successfully" });
//     } else {
//       res.status(404).json({ message: "Poem not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// export default router;

// adding new route for change in subscriber code

import express from "express";
import Poem from "../models/Poem.js";
import { protect } from "../middleware/auth.js";
import { sendNewPoemNotification } from "../services/emailService.js";

const router = express.Router();

// Get all published poems (public route)
router.get("/published", async (req, res) => {
  try {
    const poems = await Poem.find({ published: true }).sort({ createdAt: -1 });
    res.json(poems);
  } catch (error) {
    console.error("Error fetching published poems:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all poems (protected - admin only)
router.get("/", protect, async (req, res) => {
  try {
    const poems = await Poem.find({}).sort({ createdAt: -1 });
    res.json(poems);
  } catch (error) {
    console.error("Error fetching all poems:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Create new poem (protected - admin only)
router.post("/", protect, async (req, res) => {
  try {
    const { title, content, mood, published } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const poem = new Poem({ title, content, mood, published });
    const createdPoem = await poem.save();

    console.log(`✅ Poem created: "${createdPoem.title}"`);
    console.log(`Published status: ${createdPoem.published}`);

    // Send email notification if poem is published
    if (createdPoem.published) {
      console.log("🔔 Triggering email notification for new published poem...");

      // Don't await - let it run in background
      sendNewPoemNotification(createdPoem)
        .then((result) => {
          if (result.success) {
            console.log(
              `📧 Email notification sent to ${result.count} subscribers`
            );
          } else {
            console.error("📧 Email notification failed:", result.error);
          }
        })
        .catch((err) => {
          console.error("📧 Email notification error:", err);
        });
    }

    res.status(201).json(createdPoem);
  } catch (error) {
    console.error("Error creating poem:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update poem (protected - admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, content, mood, published } = req.body;
    const poem = await Poem.findById(req.params.id);

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    const wasAlreadyPublished = poem.published;

    poem.title = title || poem.title;
    poem.content = content || poem.content;
    poem.mood = mood || poem.mood;

    if (published !== undefined) {
      poem.published = published;
    }

    const updatedPoem = await poem.save();

    console.log(`✅ Poem updated: "${updatedPoem.title}"`);
    console.log(
      `Was published: ${wasAlreadyPublished}, Now published: ${updatedPoem.published}`
    );

    // Send notification only if poem is being published for the first time
    if (!wasAlreadyPublished && updatedPoem.published) {
      console.log(
        "🔔 Triggering email notification for newly published poem..."
      );

      // Don't await - let it run in background
      sendNewPoemNotification(updatedPoem)
        .then((result) => {
          if (result.success) {
            console.log(
              `📧 Email notification sent to ${result.count} subscribers`
            );
          } else {
            console.error("📧 Email notification failed:", result.error);
          }
        })
        .catch((err) => {
          console.error("📧 Email notification error:", err);
        });
    }

    res.json(updatedPoem);
  } catch (error) {
    console.error("Error updating poem:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete poem (protected - admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    await Poem.deleteOne({ _id: req.params.id });
    console.log(`✅ Poem deleted: "${poem.title}"`);

    res.json({ message: "Poem removed successfully" });
  } catch (error) {
    console.error("Error deleting poem:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
