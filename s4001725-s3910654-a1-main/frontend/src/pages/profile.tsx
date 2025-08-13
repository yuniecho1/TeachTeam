import { useState, useEffect } from "react";
import { 
  Box, 
  Text, 
  Heading, 
  VStack, 
  HStack, 
  Card, 
  CardBody, 
  Badge, 
  useToast,
  Divider,
  Container
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Navbar from "../pages/components/postNavbar";
import Footer from "./components/footer";
import { getUserById, getUserType } from "./api/api";

interface User {
  username: string;
  password: string;
  userType: string;
  name: string;
  surname: string;
  dateJoined: string;
}

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    // Get current user from sessionStorage 
    const userData = Number(sessionStorage.getItem("userId"));
    console.log("retrieved userData = " + userData);
    if (userData) {
      getUserById(userData).then((response: any) => {
        const user = response as User;
        getUserType(userData).then(typeResponse => {
          setCurrentUser({ ...user, userType: typeResponse.userType });
        });
      });
    } else {
      // Redirect to signin if no user found
      router.push("/signin");
    }
  }, [router]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!currentUser) {
    return (
      <Box className="page-wrapper">
        <Navbar />
        <Container className="loading-container">
          <Text className="loading-text">Loading...</Text>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box className="page-wrapper">
      <Navbar />
      
      <Container className="profile-container">
        <Box className="welcome-section">
          <Heading className="welcome-title">
            Welcome {currentUser.name} {currentUser.surname}
          </Heading>
          <Text className="welcome-subtitle">
            Candidate Profile Dashboard
          </Text>
        </Box>

        <Card className="profile-card">
          <CardBody>
            <VStack className="profile-content">
              
              <Box className="profile-header">
                <Heading className="profile-name">
                  {currentUser.name} {currentUser.surname}
                </Heading>
                <Badge className="user-type-badge">
                  {currentUser.userType ? currentUser.userType.charAt(0).toUpperCase() + currentUser.userType.slice(1) : ''}
                </Badge>
              </Box>

              <Divider />

              <VStack className="profile-info-section">
                <Heading className="section-title">
                  Profile Information
                </Heading>
                
                <HStack className="info-row">
                  <Text className="info-label">
                    First Name:
                  </Text>
                  <Text className="info-value">
                    {currentUser.name}
                  </Text>
                </HStack>

                <HStack className="info-row">
                  <Text className="info-label">
                    Last Name:
                  </Text>
                  <Text className="info-value">
                    {currentUser.surname}
                  </Text>
                </HStack>

                <HStack className="info-row">
                  <Text className="info-label">
                    Email Address:
                  </Text>
                  <Text className="info-value">
                    {currentUser.username}
                  </Text>
                </HStack>

                <HStack className="info-row">
                  <Text className="info-label">
                    User Role:
                  </Text>
                  <Badge className="role-badge">
                    {currentUser.userType ? currentUser.userType.charAt(0).toUpperCase() + currentUser.userType.slice(1) : ''}
                  </Badge>
                </HStack>

                <HStack className="info-row">
                  <Text className="info-label">
                    Date Joined:
                  </Text>
                  <Text className="info-value">
                    {formatDate(currentUser.dateJoined)}
                  </Text>
                </HStack>
              </VStack>

              <Divider />
            </VStack>
          </CardBody>
        </Card>
      </Container>
      
      <Footer />
    </Box>
  );
}