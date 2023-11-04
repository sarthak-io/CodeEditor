const express = require("express");
const app = express();
const bodyP = require("body-parser");
const compiler = require("compilex");
const cors = require("cors");
const options = { stats: true };
compiler.init(options);
app.get("/", function (req, res) {
    compiler.flush(function () {
        console.log("deleted")
    })
      const indexPath = 'index.html';
      res.sendFile(indexPath, { root: __dirname });
    });
   app.use(bodyP.json());
app.post("/compile", function (req, res) {
    var code = req.body.code
    var input = req.body.input
    var lang = req.body.lang
    try {

        if (lang == "Cpp") {
            if (!input) {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; // (uses g++ command to compile )
                compiler.compileCPP(envData, code, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
            else {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; // (uses g++ command to compile )
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
        }
        else if (lang == "Java") {
            if (!input) {
                var envData = { OS: "windows" };
                compiler.compileJava(envData, code, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                })
            }
            else {
                //if windows  
                var envData = { OS: "windows" };
                //else
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                })
            }
        }
        else if (lang == "Python") {
            if (!input) {
                var envData = { OS: "windows" };
                try {
                    compiler.compilePython(envData, code, function (data) {
                        console.log(data.output);
                        if (data.output) {
                            res.send(data);
                        } else {
                            res.send({ output: "error404" });
                        }
                    });
                } catch (error) {
                    // Log the error when Python compilation fails
                    console.error("Python Compilation Error:", error);
                    res.status(500).send({ error: "An error occurred during Python compilation." });
                }
            } else {
                var envData = { OS: "windows" };
                try {
                    compiler.compilePythonWithInput(envData, code, input, function (data) {
                        console.log(data.output);
                        if (data.output) {
                            res.send(data);
                        } else {
                            res.send({ output: "error404" });
                        }
                    });
                } catch (error) {
                    // Log the error when Python compilation with input fails
                    console.error("Python Compilation with Input Error:", error);
                    res.status(500).send({ error: "An error occurred during Python compilation with input." });
                }
            }
        }
        
    }
    catch (error) {
    console.error("Compilation Error:", error);
    // Optionally, you can send an error response to the client
    res.status(500).send({ error: "An error occurred during compilation." });
    }
})
app.listen(8000)