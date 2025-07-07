const { default: mongoose } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const validatePassword = function (password) {
    return (
        password.length >= 5 &&
        password.length <= 20 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
    );
};

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "##-User-Must-Have-A-Name-##"],
    },
    email: {
        type: String,
        required: [true, "##-User-Must-Have-Email-##"],
        unique: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: "##-Invalid-Email-Address-##",
        },
    },
    photo: String,
    role: {
        type: String,
        enum: ["user", "guide", "lead-guide", "admin"],
        defalut: "user",
    },
    password: {
        type: String,
        required: [true, "##-User-Must-Have-A-Password-##"],
        validate: {
            validator: validatePassword,
            message:
                "##-Password-Must-Be-5-To-20-Characters-And-Include-Uppercase,Lowercase-&-Number-##",
        },
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "##-Please-Confirm-Your-Password-##"],
        validate: {
            validator: function (passwordConfirm) {
                return this.password === passwordConfirm;
            },
            message: "##-Password-And-PasswordConfirm-Need-To-Be-Same-##",
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

////////////////////////////////////////
// DOCUMENT MEDDLEWARE / HOOK //////////

// runs before Model.prototype.save() and Model.create()
userSchema.pre("save", async function (next) {
    // Only run the Function if the password has been changes
    // For Ex. ( if user is changing the email, no need to hash the password in that case)
    if (!this.isModified("password")) return next();

    // Hash Password
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
