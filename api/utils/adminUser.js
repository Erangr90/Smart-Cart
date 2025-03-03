import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "./generateToken.js";

const CreateAdminUser = asyncHandler(async (req, res, next) => {

    const admin = await User.findOne({ email: "admin@mail.com" });

    if (admin) {
        next();
    }

    const user = await User.create({
        firstName: "Admin",
        lastName: "Admin",
        email: "admin@mail.com",
        password: "ASDF1234asdf!",
        isAdmin: true,
        isSubtribe: true,
        clicks: 0
    });
    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            isSubtribe: user.isSubtribe,
            clicks: user.clicks
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }

});

export {
    CreateAdminUser
};