import React from "react";
import Link from "next/link";
import { Heading } from "@chakra-ui/react"
import { Flex, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";


const Navbar: React.FC = () => {
    const router = useRouter();
    const toast = useToast();

    const handleSignOut = () => {

        //This will be necessary when storing in DB and API calling, but unusable now as we need to retain data to show lecturer preferences
        toast({
            title: "Signed out successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
        });

        sessionStorage.removeItem('userId');
        
        router.push("/");
    };

    return (
      <Flex className="lectNav-container">
        <Heading as="h1" className= "teachteam-logo" >
            TeachTeam
        </Heading>
  
      <Flex className="lectNavlinks-container" >
          <Text as="span" className="lectNavlinks" onClick={handleSignOut}>
            Sign Out
          </Text>
          
        </Flex>
      </Flex>
    );
  };

  export default Navbar;