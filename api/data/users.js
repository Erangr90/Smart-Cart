import bcrypt from "bcryptjs";

const users = [
  {
    firstName: "זיו",
    lastName: "גריידי",
    email: "ziv132@gmail.com",
    password: bcrypt.hashSync("12345678", 10),
    subscription: "",
  },
  {
    firstName: "אדיר",
    lastName: "גריידי",
    email: "adir@gmail.com",
    password: bcrypt.hashSync("12345678", 10),
    isAdmin: true,
  },
];

export default users;
