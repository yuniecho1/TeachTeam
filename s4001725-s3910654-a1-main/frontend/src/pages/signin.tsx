import { useState } from "react";
import { Box, Input, Text, useToast, Button, Heading, Radio, Stack, RadioGroup} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react'
import Link from "next/link";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useRouter } from "next/router";
import api from '@/pages/api/api';
// import { UserType } from "../entity/enums";

export default function Home() {
  // variables for form fields and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");
  // const [userType, setUserType] = useState<UserType>(UserType.CANDIDATE);

  // hooks for routing and toast notifications
  const router = useRouter();
  const toast = useToast();
  
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post('/users/login', {
        username: email,
        password: password
      });
      const { userType, user } = response.data;

      toast({
        title: "Sign in successful!",
        description: `Welcome ${user.name}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      sessionStorage.setItem('userId', user.user_id.toString());
      console.log("user_id = " + user.user_id);

      if (userType === "candidate") {
        router.push("/profile");
      } else if (userType === "lecturer") {
        router.push("/lecturers");
      } else if (userType === "admin") {
        router.push("/lecturers");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("Invalid username or password");
      toast({
        title: "Sign in failed",
        description: "Invalid username or password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Navbar />

      <div className="formContainer">
        <div className="formHeading">
          <Heading>Sign In</Heading>
        </div>

        {error && (
          <Box p={3} mb={4} color="red.500" bg="red.50" borderRadius="md">
            <Text>{error}</Text>
          </Box>
        )}

        <div className="formFields">
          <FormControl isRequired className="formControl">
            <FormLabel>Email address</FormLabel>
            <Input 
              type='email' 
              size="md" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormHelperText>Forgot your email?</FormHelperText>
          </FormControl>

          <FormControl isRequired className="formControl">
            <FormLabel>Password</FormLabel>
            <Input
              type='password' 
              size="md" 
              value={password} 
              onChange={(e)=> setPassword(e.target.value)}
            />
            <FormHelperText>Forgot your password?</FormHelperText>
          </FormControl>
        </div>

        <div className="formLink"> 
          <Link href="/signup" passHref>
            <Text as="span">
              Don't have an account yet? Register Now !
            </Text>
          </Link>
        </div>

        <div className="formButton">
          <Button type="submit" onClick={handleSignIn}>Sign In</Button>
        </div>
      </div>

      <Footer />
    </Box>
  );
}