import React from "react";
import { Box, Flex, Text, Link } from "@chakra-ui/react";

const Footer: React.FC = () => {
  return (
    <Box className="footer-container">
      <Flex className="footer-content">
        <Text className="footer-copyright">
          TeachTeam © {new Date().getFullYear()}
        </Text>

        <Flex className="footer-links">
          <Link href="/about" _hover={{ color: "white", cursor: "pointer" }}>About Us</Link>
          <Link href="/contact" _hover={{ color: "white", cursor: "pointer" }}>Contact Us</Link>
          <Link href="/privacy" _hover={{ color: "white", cursor: "pointer" }}>Our Privacy Policy</Link>
        </Flex>

        <Flex className="footer-social">
          <Link href="https://facebook.com" isExternal _hover={{ color: "white", cursor: "pointer" }}>Facebook</Link>
          <Link href="https://instagram.com" isExternal _hover={{ color: "white", cursor: "pointer" }}>Twitter</Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
