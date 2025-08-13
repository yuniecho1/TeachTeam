import React from "react";
import Link from "next/link";
import { Heading } from "@chakra-ui/react"
import { Flex, Text } from "@chakra-ui/react";

const Navbar: React.FC = () => {
    return (
      <Flex className="navbar-container">
        <Link href="/" passHref>
          <Heading as="h1" className= "teachteam-logo">
            TeachTeam
          </Heading>
        </Link>
  
      <Flex className="links-container">
          <Link href="/tutors" passHref>
            <Text as="span" className="nav-link">
              How to become a Tutor!
            </Text>
          </Link>
          <Link href="/signup" passHref>
            <Text as="span" className="nav-link">
              Sign Up
            </Text>
          </Link>
          <Link href="/signin" passHref>
            <Text as="span" className="nav-link">
              Sign In
            </Text>
          </Link>
        </Flex>
      </Flex>
    );
  };

  export default Navbar;