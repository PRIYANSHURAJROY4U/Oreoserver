// import mongoose from "mongoose";

// const PoemSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     preview: { type: String },
//     mood: { type: String },
//     likes: { type: Number, default: 0 },
//     published: { type: Boolean, default: false },
//     author: { type: String } // username
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Poem || mongoose.model("Poem", PoemSchema);





// import mongoose from "mongoose";

// const poemSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, "Please add a title"],
//       trim: true,
//     },
//     content: {
//       type: String,
//       required: [true, "Please add content"],
//     },
//     preview: {
//       type: String,
//     },
//     mood: {
//       type: String,
//       default: "dreamy",
//       enum: [
//         "dreamy",
//         "romantic",
//         "whimsical",
//         "ethereal",
//         "magical",
//         "mystical",
//       ],
//     },
//     published: {
//       type: Boolean,
//       default: false,
//     },
//     author: {
//       type: String,
//       // required: true,
//     },
//   },
//   { timestamps: true }
// );

// // A pre-save hook to automatically generate the preview from the poem's content
// poemSchema.pre("save", function (next) {
//   this.author = "@oreongutan // @oftoreo";
//   if (this.isModified("content")) {
//     const firstLine = this.content.split("\n")[0];
//     this.preview =
//       firstLine.length > 80
//         ? firstLine.substring(0, 80) + "..."
//         : firstLine + (this.content.includes("\n") ? "..." : "");
//   }
//   next();
// });

// const Poem = mongoose.model("Poem", poemSchema);

// export default Poem;










import mongoose from 'mongoose';

const poemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  preview: {
    type: String,
  },
  mood: {
    type: String,
    default: 'dreamy',
    enum: ['dreamy', 'romantic', 'whimsical', 'ethereal', 'magical', 'mystical'],
  },
  published: {
    type: Boolean, // <-- THIS LINE IS CRUCIAL
    default: false,
  },
  author: {
    type: String,
  }
}, { timestamps: true });

poemSchema.pre('save', function(next) {
  this.author = '@oreongutan // @oftoreo';

  if (this.isModified('content')) {
    const firstLine = this.content.split('\n')[0];
    this.preview = firstLine.length > 80
      ? firstLine.substring(0, 80) + '...'
      : firstLine + (this.content.includes('\n') ? '...' : '');
  }
  
  next();
});

const Poem = mongoose.model('Poem', poemSchema);

export default Poem;