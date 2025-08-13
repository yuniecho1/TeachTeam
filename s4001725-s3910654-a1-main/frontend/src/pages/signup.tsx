import React, { useState, useEffect } from "react";
import { Select, Box, Input, Button, Heading, useToast, Radio , RadioGroup, Stack} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react'
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Router, { useRouter } from "next/router";
import { signup } from './api/api';

interface User {
  id: number; 
  name: string;
  surname: string;
  email: string;
  password: string;
  userType: string;
  dateJoined: string;
}
export default function Home() {
  // variables for form fields 
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  // hooks for toast notifications and routing
  const toast = useToast();
  const router = useRouter();

  // clear form fields
  const resetForm = () => {
    setName("");
    setSurname("");
    setEmail("");
    setPassword("");
    setUserType("");
  };

  // validate email format
  const isValidEmailFormat = (email: string): boolean => {
    return email.includes('@') && email.toLowerCase().endsWith('.com');
  };

  // validate strong password
  const validateStrongPassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check minimum length (increased to 8 for stronger security)
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    // Check for number
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async () => {
    // field validation
    if (!name || !surname || !email || !password || !userType) {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // email format validation
    if (!isValidEmailFormat(email)) {
      toast({
        title: "Email Error",
        description: "Please enter a valid email address with '@' and ending with '.com'",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // // check if email is already in use
    // if (isEmailAlreadyUsed(email)) {
    //   toast({
    //     title: "Email Error",
    //     description: "This email is already registered. Please use a different email.",
    //     status: "error",
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   return;
    // }

    // strong password validation
    const passwordValidation = validateStrongPassword(password);
    if (!passwordValidation.isValid) {
      toast({
        title: "Password Error",
        description: passwordValidation.errors.join(". "),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // role (radio) validation
    if (userType !== "candidate" && userType !== "lecturer") {
      toast({
        title: "Role Error",
        description: "Please select either 'Tutor' or 'Lecturer' as your role",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Create user data and push to db
    try {
      await signup({
        role: userType,
        firstName: name,
        lastName: surname,
        email,
        password
      });
      toast({
        title: "Sign up successful!",
        description: "You can now sign in!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/signin");
      resetForm();
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.response?.data?.error || "An error occurred during signup.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    resetForm();
  };

  return (
    <Box>
      <Navbar />

      <div className = "formContainer">
        <div className = "formHeading">
        <Heading>Sign Up</Heading>
        </div>

        <div className = "formFields">
          <FormControl isRequired className="formControl" mt={4}>
            <FormLabel>Select a role:</FormLabel>
              <RadioGroup className="radio" onChange={setUserType} value={userType}>
                <Stack direction="row" spacing={5}>
                  <Radio value="candidate">Candidate</Radio>
                  <Radio value="lecturer">Lecturer</Radio>
                </Stack>
              </RadioGroup>
          </FormControl>

          <FormControl isRequired className = "formControl">
            <FormLabel>First Name</FormLabel>
            <Input 
              type='text' 
              size="md" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired className = "formControl">
            <FormLabel>Last Name</FormLabel>
            <Input 
              type='text' 
              size="md" 
              required 
              value={surname} 
              onChange={(e) => setSurname(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired className = "formControl">
            <FormLabel>Email address</FormLabel>
            <Input 
              type='email' 
              size="md" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired className = "formControl">
            <FormLabel>Password</FormLabel>
            <Input 
              type='password' 
              size="md" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
              <FormHelperText textAlign="left">
                Password must be at leat 8 characters long and include at least one uppercase and one special character.
              </FormHelperText>
          </FormControl>
        </div>
          
        <div className="formButton">
          <Button type="submit" onClick={handleSubmit}>
            Sign Up
          </Button>
      </div>
    </div>
    
    <Footer />
    </Box>
  );
}