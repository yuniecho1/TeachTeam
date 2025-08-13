import React from "react";
import { Heading, Box, Flex, Text, Button} from "@chakra-ui/react"
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Router, { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/signin");
  };

  return (
    <Box>
      <Navbar />

        <Box className="tutors-container">
            <Box className="header">
                <Heading as="h1">
                How to become a member of the TeachTeam Tutor Team
                </Heading>
                <Text as="p" >
                Are you a university student who excels in computer science and loves helping others? Join TeachTeam—a platform that lets you turn your knowledge into opportunity. As a TeachTeam tutor, you’ll get to support fellow students in their CS courses, sharpen your own understanding, and earn money on a flexible schedule that works around your classes. It’s the perfect way to boost your resume, grow your confidence, and make a difference in your campus community. Start tutoring today and become a go-to guide for someone’s coding journey!
                </Text>
            </Box>

            <Box className="qualities">
              <Heading className="qualities-eligibility">Eligibility</Heading>
                <Flex gap={4} direction={"column"}>
                    <Text className="qualities-text"> • Currently enrolled in Computer Science, Software Engineering, or Data Science at RMIT University</Text>
                    <Text className="qualities-text"> • Second Year of Degree or higher</Text>
                    <Text className="qualities-text"> • Received grade of HD in desired teaching unit</Text>
                </Flex>

              <Heading className="qualities-skills">Key Skills We Look For</Heading>
                <Flex gap={4} direction={"column"}>
                    <Text className="qualities-text"> • Proficiency in programming languages (Python, Java, C++, JavaScript)</Text>
                    <Text className="qualities-text"> • Deep understanding in data structures and algorithms</Text>
                    <Text className="qualities-text"> • Ability to adapt teaching style to different learning needs</Text>
                    <Text className="qualities-text"> • Excellent time management and reliability</Text>
                </Flex>
            </Box>

            <div className="apply-button">
              <Button type="submit" onClick={handleSignIn}>Apply Now!</Button>
            </div>
        </Box> 

        <Box className="info-box">
          <Heading as="h3" size="m" className="info-heading">Position Details</Heading>
          <Text className="info-text"><b>Rate:</b> $20-$50 per hour depending on level of skill</Text>
          <Text className="info-text"><b>Location:</b> On-Site, Hybrid, Remote</Text>
          <Text className="info-text"><b>Hours:</b> Flexible Hours</Text>
        </Box>

      <Footer />
    </Box>

  );
}