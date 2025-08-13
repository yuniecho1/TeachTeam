import React from "react";
import Link from "next/link";
import { Heading } from "@chakra-ui/react"
import { Flex, Text, useToast, Menu, MenuButton, MenuItem, MenuList, MenuDivider} from "@chakra-ui/react";
import { useRouter } from "next/router";


const Navbar: React.FC = () => {
    const router = useRouter();
    const toast = useToast();

    const handleSignOut = () => {
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
      <Flex className="postnavbar-container">
        <Heading as="h1" className= "teachteam-logo">
          <Link href="/profile" passHref>
              TeachTeam
          </Link>
        </Heading>
  
        <Flex className="postlinks-container" >
          <Link href="/tutorRegistration" passHref>
            <Text as="span" className="postnav-link">
              Apply for Jobs
            </Text>
          </Link>

          <Menu>
            <MenuButton 
              as={Text} 
              className="postnav-link"
              cursor="pointer"
            >
              My Profile
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} href="/profile">
                View Profile
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleSignOut}>
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    );
  };

  export default Navbar;