import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      required: true,
    },
    createdBy:{
        
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    
    },
    subTodos:[
      {
        type: mongoose.Schema.Types.ObjectId,
      ref:"SubTodo"
      }
    ]
  },
  { timestamps: true }
);

export const SubTodo = mongoose.model("SubTodo",todoSchema)