import React, { useState } from "react";
import { 
    Select, 
    Box, 
    Button, 
    Heading, 
    Input, 
    useToast, 
    Checkbox, 
    CheckboxGroup, 
    SimpleGrid, 
    Radio, 
    RadioGroup,
    Stack,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";
import Navbar from "../pages/components/postNavbar";
import Footer from "../pages/components/footer";
import api, { submitMultipleApplications } from '@/pages/api/api';

export default function Home() {
    // toast notifications for form feedback
    const toast = useToast();

    // form state variables using hooks to store and update variable values. 
    const [position, setPosition] = useState("");
    const [fieldOfStudy, setFieldOfStudy] = useState("");
    const [credentials, setCredentials] = useState("");
    const [unitsOfStudy, setUnitsOfStudy] = useState<string[]>([]);
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState("");
    const [availability, setAvailability] = useState("");

    const handleUnitChange = (unitsOfStudy: string[]) => {
        setUnitsOfStudy(unitsOfStudy);
    };

    const handleSubmit = async () => {
        // Get current user ID from session storage
        const userId = sessionStorage.getItem('userId');
        
        if (!userId) {
            toast({
                title: "Error",
                description: "Please log in first",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // check if all fields have been selected/filled
        let hasError = false;
        
        if (!position) {
            toast({
                title: "Error",
                description: "Please select a position",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            hasError = true;
        }
        
        if (!fieldOfStudy) {
            toast({
                title: "Error",
                description: "Please select your degree",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            hasError = true;
        }
        
        if (!credentials) {
            toast({
                title: "Error",
                description: "Please select your level of study",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            hasError = true;
        }
        
        if (unitsOfStudy.length === 0) {
            toast({
                title: "Error",
                description: "Please select at least one course",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            hasError = true;
        }
        
        if (!skills) {
            toast({
                title: "Error",
                description: "Please enter your skills",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            hasError = true;
        }
        
        if (!availability) {
            toast({
                title: "Error",
                description: "Please select availability",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            hasError = true;
        }
        
        if (hasError) {
            return;
        }

        //preparing data for submission
        const baseData = {
            candidate_id: Number(sessionStorage.getItem('userId')),
            position: position === 'tutor-role' ? 'tutor' as const : 'lab_assistant' as const,
            degree: fieldOfStudy,
            level: credentials,
            skills: skills, 
            availability: availability.replace('-', '_') 
        };
        try {
            const result = await submitMultipleApplications(baseData, unitsOfStudy);

            if (result.successCount > 0) {
                toast({
                    title: "Applications Submitted!",
                    description: `${result.successCount} applications created successfully`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }

            if (result.errorCount > 0) {
                toast({
                    title: "Some Applications Failed",
                    description: `You have already applied for this position. ${result.errorCount} applications failed.`,
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                });
                console.log("Errors:", result.errors);
            }

            // Reset form if at least some succeeded
            if (result.successCount > 0) {
                setPosition("");
                setFieldOfStudy("");
                setCredentials("");
                setUnitsOfStudy([]);
                setSkills("");
                setExperience("");
                setAvailability("");
            }

        } catch (error) {
            toast({
                title: "Submission Failed",
                description: "Failed to submit applications. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Bulk submission error:", error);
        }
    };

    return (
        <Box>
            <Navbar />

            <div className="formContainer">
                <div className="formHeading">
                    <Heading>Tutor Registration</Heading>
                </div>

                <div className="formFields">
                    <FormControl isRequired className="formControl" mt={4}>
                        <FormLabel>Which position are you applying for?:</FormLabel>
                        <RadioGroup onChange={setPosition} value={position}>
                            <Stack direction="row" spacing={5}>
                                <Radio
                                    value="tutor-role" 
                                    colorScheme="green"
                                >
                                    Tutor
                                </Radio>
                                <Radio 
                                    value="lab-assistant" 
                                    colorScheme="green"
                                >
                                    Lab-Assistant
                                </Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>

                    <FormControl isRequired className="formControl">
                        <FormLabel>What are you currently studying?</FormLabel>
                        <Select 
                            name="degree" 
                            onChange={(e) => setFieldOfStudy(e.target.value)}
                            value={fieldOfStudy}
                            placeholder="Select degree..."
                        >
                            {["Computer Science", "Software Engineering", "Data Science"].map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl isRequired className="formControl">
                        <FormLabel>What is your level of Study?</FormLabel>
                        <Select 
                            name="degreeOfStudy" 
                            onChange={(e) => setCredentials(e.target.value)}
                            value={credentials}
                            placeholder="Select level of degree..."
                        >
                            {["Bachelor's Degree", "Honours", "Masters", "PhD"].map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl isRequired className="formControl">
                        <FormLabel>Select a course to apply for</FormLabel>
                        <CheckboxGroup colorScheme="green" onChange={handleUnitChange} value={unitsOfStudy}>
                            <Box maxH="250px" overflowY="auto" p={2}>
                                <SimpleGrid columns={2} spacing={2}>
                                    <Checkbox value="COSC1901">COSC1901 Programming Bootcamp 1</Checkbox>
                                    <Checkbox value="COSC1902">COSC1902 Programming Bootcamp 2</Checkbox>
                                    <Checkbox value="COSC1805">COSC1805 Introduction to Mathematics</Checkbox>
                                    <Checkbox value="COSC1806">COSC1806 Advanced Mathematics</Checkbox>
                                    <Checkbox value="COSC1990">COSC1990 Algorithm Analysis</Checkbox>
                                    <Checkbox value="COSC2996">COSC2996 Data Structures</Checkbox>
                                    <Checkbox value="COSC3457">COSC3457 Software Engineering Fundamentals</Checkbox>
                                    <Checkbox value="COSC2341">COSC2341 Full Stack Web Development</Checkbox>
                                    <Checkbox value="COSC7910">COSC7910 Cyber Security</Checkbox>
                                    <Checkbox value="COSC1871">COSC1871 Introduction to Artificial Intelligence</Checkbox>
                                </SimpleGrid>
                            </Box>
                        </CheckboxGroup>
                    </FormControl>

                    <FormControl className="formControl">
                        <FormLabel>Select any previous roles you have held</FormLabel>
                        <CheckboxGroup colorScheme="green">
                            <Box maxH="250px" overflowY="auto" p={2}>
                                <SimpleGrid columns={2} spacing={2}>
                                    <Checkbox value="COSC1901">COSC1901 Programming Bootcamp 1</Checkbox>
                                    <Checkbox value="COSC1902">COSC1902 Programming Bootcamp 2</Checkbox>
                                    <Checkbox value="COSC1805">COSC1805 Introduction to Mathematics</Checkbox>
                                    <Checkbox value="COSC1806">COSC1806 Advanced Mathematics</Checkbox>
                                    <Checkbox value="COSC1990">COSC1990 Algorithm Analysis</Checkbox>
                                    <Checkbox value="COSC2996">COSC2996 Data Structures</Checkbox>
                                    <Checkbox value="COSC3457">COSC3457 Software Engineering Fundamentals</Checkbox>
                                    <Checkbox value="COSC2341">COSC2341 Full Stack Web Development</Checkbox>
                                    <Checkbox value="COSC7910">COSC7910 Cyber Security</Checkbox>
                                    <Checkbox value="COSC1871">COSC1871 Introduction to Artificial Intelligence</Checkbox>
                                </SimpleGrid>
                            </Box>
                        </CheckboxGroup>
                    </FormControl>

                    <FormControl isRequired className="formControl">
                        <FormLabel>What is your skill set? (Programming Languages, Frameworks etc)</FormLabel>
                        <Input 
                            onChange={(e) => setSkills(e.target.value)}
                            value={skills}
                            placeholder="Enter skills. Make sure to separate by commas."
                        />
                    </FormControl>

                    <FormControl isRequired className="formControl" mt={4}>
                        <FormLabel>Availability:</FormLabel>
                        <RadioGroup onChange={setAvailability} value={availability}>
                            <Stack direction="row" spacing={5}>
                                <Radio
                                    value="part-time" 
                                    colorScheme="green"
                                >
                                    Part-Time
                                </Radio>
                                <Radio 
                                    value="full-time" 
                                    colorScheme="green"
                                >
                                    Full-Time
                                </Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </div>

                <div className="formButton">
                    <Button type="submit" onClick={handleSubmit}>
                        Registration
                    </Button>
                </div>
            </div>
            
            <Footer />
        </Box>
    );
}