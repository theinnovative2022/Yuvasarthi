const express = require("express")
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");

require("./db/conn");
const register = require("./models/registers")
const port = process.env.PORT || 7000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

console.log(process.env.SECRET_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);


app.get("/", (req, res) => {
    res.render("index")
})
app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
})

//create a new user in our database
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {

            const registerEmployee = new register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })

             console.log("the successfull part" +registerEmployee)
            const token = await registerEmployee.generateAuthToken();
            console.log("the success part" +token)
            


            const registerd = await registerEmployee.save()
            res.status(201).render("index")

        } else {
            res.send("password are not matching")
        }

    } catch (error) {
        res.status(400).send(error);
    }
})


//login check
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await register.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, useremail.password)
        const token = await useremail.generateAuthToken();
            console.log("the success part" +token)
            
        if (isMatch) {
            res.status(201).render("index");
        } else {
            res.send("invalid password details")
        }
    } catch (error) {
        res.status(400).send("invalid login info")
        console.log("the error part page")
    }
});




// const bcrypt = require("bcryptjs");
// const securePassword = async (password) => {
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     const passwordmatch = await bcrypt.compare(password, passwordHash);
//     console.log(passwordmatch);
// }

// securePassword("sakshi@123");


// const jwt = require("jsonwebtoken");


// const createToken = async () => {
//     const token = await jwt.sign({ _id:"633b1afed33a83209b743483"}, "mynameissakshikadaveimsohappyandgood",{
//         expiresIn:"2 seconds"
//     })
//     console.log(token);

//     const userVer = await jwt.verify(token,"mynameissakshikadaveimsohappyandgood")
//     console.log(userVer)

// }
// createToken();

app.listen(port, () => {
    console.log(`listening to the port no ${port}`)
});