import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler( async (req, res) => {
  // get the user from the frontend / postman
  //validation - not empty fields
  //check if user alreay exists
  //check for images and check for avatar
  // upload the images or avatar to cloudinary
  // create user object - create entry in db
  // remove password and refrsh token field from response
  // check for user creation
  // return response


  // 1) getting details of the user
  const {fullname, email, username, password} = req.body;
  console.log("email: ", email);


  // -----------------simple beginner method of creating error ----------------
  // if(fullname === "") {
  //   throw new ApiError(400, "fullname is required")
  // }
  // 

  // 2) Validation check , checking for empty fields
  if( // the below code returns true if any of the field after getting trimeed is empty
    [fullname, email, username, password].some((field) => field?.trim() === trim)
  ){
    throw new ApiError(400, "All fields are required")
  }
  // 3) checking if the user already exists
  const existedUser = User.findOne({
    $or: [{ username }, { email }]
  })

  if(existedUser) {
    throw new ApiError(409, "User with same email or username already exists")
  }
  // 4) check for images and avatar
    const avatarLocalPath = req.files?.avatar[0].path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath) {
      throw new ApiError("Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath,)
    const coverImageawait = await uploadOnCloudinary(coverImageLocalPath,)
    

    // 5) Strict checking for avatar, if uploaded properly or not as it is required

    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }
    // 6) creating user object and pushing it in DB
    const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "", // using ternary operator,
      email,
      password,
      username: username.toLowerCase()
    })
    // 6) Hiding password and refresh tokens
   const createdUser =  await User.findById(user._id).select(
    "-password -refreshToken"
   )
   // 7) check for user creation
   if(!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
   }
   // 8) return response
   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered succesfully")
   )

  })


export {registerUser};