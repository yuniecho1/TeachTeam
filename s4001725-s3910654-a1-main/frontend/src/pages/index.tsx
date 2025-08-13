import React from "react";
import { Heading, Flex, Text } from "@chakra-ui/react"
import { Box, Button } from "@chakra-ui/react";
import Image from "next/image";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Router, { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/signup");
  };

  return (
    <Box className="index-container">
      <Navbar />
      <Box>
        <Image src="/teachteam.png" alt="TeachTeam Logo" className="index-image" width={1425} height={200}/>
      </Box>

      <Box className="section-heading">
        <Heading as="h2" className="heading-text"> What is TeachTeam? </Heading>
      </Box>

      <Box className="section-description">
        TeachTeam is a specialized tutoring platform connecting Computer Science students with expert tutors. 
        Whether you're struggling with algorithms, need help with programming assignments, or want to master 
        new technologies, our verified tutors provide personalized support to accelerate your learning journey.
      </Box>

      <Box className="section-heading">
        <Heading as="h2" className="heading-text"> Why TeachTeam? </Heading>
      </Box>

      <Flex className="feature-boxes">
        <Box className="feature-box">
          <Heading as="h3" size="lg">For Students</Heading>
          <Text >
            Find qualified tutors specializing in programming languages, data structures, algorithms, and more. 
          </Text>
          <Text>            
            Book sessions that fit your schedule and learning pace to overcome challenges and excel in your CS courses.
          </Text>
        </Box>
        
        <Box className="feature-box">
          <Heading as="h3" size="lg">For Tutors</Heading>
          <Text>
            Share your computer science expertise and earn while helping others learn. 
          </Text>
          <Text>
            Create your profile, set your availability, and connect with students looking for your specific knowledge and skills.
          </Text>
        </Box>
        
        <Box className="feature-box">
          <Heading as="h3" size="lg">How It Works</Heading>
          <Text>
            If you want to become a tutor, fill in the tutor registration form. Once accepted by lecturers, start making some extra cash through sharing your knowledge!
          </Text>
          <Text>  
            If you want to hire a tutor, go to the Hire a Tutor page and deepen your knowledge in Computer Science. 
          </Text>
        </Box>
      </Flex>

      <Box className="signuplink-container">
          <Text className="signup-link" onClick={handleSignIn}> Become a part of our team!</Text>
      </Box>
      
      <Footer />
    </Box>

  );
}