import React, { useState, useEffect } from "react";
import {
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    Flex,
    Heading,
    Text,
    Button,
    Select,
    IconButton,
    Badge,
    VStack,
    HStack,
    Divider,
    Textarea
} from "@chakra-ui/react";
import {DragDropContext, Droppable, Draggable, DropResult} from "@hello-pangea/dnd";
import { MdArrowUpward, MdArrowDownward, MdSearch } from "react-icons/md";
import Navbar from "./components/lecturerNav";
import Footer from "./components/footer";
import api, { fetchLecturerCourseApplicants, fetchApplicants, handleCandidateSelection, saveComment } from "./api/api";

export enum AppliedRole {
    LECTURER = "lecturer",
    CANDIDATE = "candidate"
}
 
export enum Availability {
    FULL_TIME = "full time",
    PART_TIME = "part time"
}

//Creating applicant object
interface Applicant {
    applicationId: number;
    name: string;
    appliedCourse: string;
    roleApplied: string;
    credential?: string; 
    skills: string[];
    prevRoles: string[];
    availabilityType: string;
    comment: string;
}
 
// Lecturer Course Assignment interface
interface LecturerCourseAssignment {
    lecturerEmail: string;
    assignedCourses: string[];
}
 
const Lecturers = () => {
    const [selectedApplication, setSelectedApplication] = useState<number[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [searchString, setSearchString] = useState("");
    const [searchCategory, setSearchCategory] = useState("all");
    const [sortBy, setSortBy] = useState("rank");
    const [sortOrder, setSortOrder] = useState("asc");
    const [rankedApplicants, setRankedApplicants] = useState<Applicant[]>([]);
    const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
    const [lecturerAssignedCourses, setLecturerAssignedCourses] = useState<string[]>([]);
 
    // Initialize with default values
    const [lecturerId, setLecturerId] = useState<number | null>(null);
 
    //ID of applicant whose comment is currently being edited
    const [editCommentId, setEditCommentId] = useState<number | null>(null);
    //Array for storing comments 
    const [comments, setComments] = useState<{ lecturerId: number, applicationId: number, comment: string }[]>([]);

    //Get lecturer ID from session storage
    useEffect(() => {
        const id = sessionStorage.getItem("userId");
        if (id) {
            setLecturerId(Number(id));
        }
    }, []);

    //Load applicants on lecturerId load
    useEffect(() => {
        console.log("lecturer id: " +  lecturerId);
        if (!lecturerId) return;

        const fetchAndSetLecturerCourses = async () => {
            try {
                const courses = await fetchLecturerCourseApplicants(lecturerId);
                setLecturerAssignedCourses(courses);
            } catch (error) {
                console.error('Failed to fetch lecturer courses:', error);
                setLecturerAssignedCourses([]);
            }
        };
        fetchAndSetLecturerCourses();
    }, [lecturerId]);

    //Load applicants on lecturerAssignedCourses load
    useEffect(() => {
        if (lecturerId && !isNaN(lecturerId)) {
            const fetchData = async () => {
                try {
                    const applicants = await fetchApplicants(lecturerId);
                    setFilteredApplicants(applicants);
                } catch (error) {
                    console.error('Failed to fetch applicants', error);
                }
            };
            fetchData();
        }
    }, [lecturerId]);

    //Load applicants on lecturerApplicants load
    useEffect(() => {
        console.log("filteredApplicants: ");
        console.log(filteredApplicants);
    }, [filteredApplicants]);


    // Updated fetchApplicants function with data transformation
    const fetchApplicants = async (lecturerUserId: number): Promise<Applicant[]> => {
        const response = await api.get(`/applications/applicants/${lecturerUserId}`);

        console.log("response: " + response.data);
        
        // Transform the API response to match your frontend interface
        const transformedData = response.data.map((apiApplicant: ApiApplicant, index: number): Applicant => ({
            id: apiApplicant.applicationId,
            name: apiApplicant.name,
            appliedCourse: apiApplicant.appliedCourse,
            roleApplied: (apiApplicant.roleApplied === 'lab_assistant' ? 'Lab assistant' : 'Tutor') as AppliedRole,
            credentials: apiApplicant.credential ? apiApplicant.credential.split(',').map(cred => cred.trim()) : [],
            skills: apiApplicant.skills ? apiApplicant.skills.split(',').map(skill => skill.trim()) : [],
            availabilityType: apiApplicant.availabilityType as Availability,
            prevRoles: apiApplicant.prevRoles ? apiApplicant.prevRoles.split(',').map(role => role.trim()) : [],
            comments: apiApplicant.comment || "",
            rank: index + 1,
            totalSelected: 0
        }));
        
        console.log(transformedData);
        return transformedData;
    };


    // Helper functions for display formatting
    const getAvailabilityDisplay = (availability: Availability): string => {
        switch (availability) {
            case Availability.FULL_TIME:
                return "Full Time";
            case Availability.PART_TIME:
                return "Part Time";
            default:
                return availability;
        }
    };

    const getRoleDisplay = (role: AppliedRole): string => {
        switch (role) {
            case AppliedRole.LECTURER:
                return "Lecturer";
            case AppliedRole.CANDIDATE:
                return "Candidate";
            default:
                return role;
        }
    };
 
    // Enhanced search function
    const performSearch = (applicants: Applicant[]) => {
        if (!searchString.trim()) return applicants;
 
        const lowerSearch = searchString.toLowerCase();
        
        return applicants.filter(applicant => {
            switch (searchCategory) {
                case "skills":
                    return applicant.skills.some(skill => skill.toLowerCase().includes(lowerSearch));
                case "name":
                    return applicant.name.toLowerCase().includes(lowerSearch);
                case "availability":
                    return getAvailabilityDisplay(applicant.availabilityType).toLowerCase().includes(lowerSearch);
                case "roleApplied":
                    return getRoleDisplay(applicant.roleApplied).toLowerCase().includes(lowerSearch);
                default:
                    return false;
            }
        });
    };
    
    // Sorting function
    const sortApplicants = (applicants: Applicant[]) => {
        const sorted = [...applicants].sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case "course":
                    comparison = a.course.localeCompare(b.course);
                    break;
                case "availability":
                    comparison = a.availabilityType.localeCompare(b.availabilityType);
                    break;
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "rank":
                default:
                    comparison = a.rank - b.rank;
                    break;
            }
            
            return sortOrder === "asc" ? comparison : -comparison;
        });
        
        return sorted;
    };
 
    //hook for updating all filter-based changes
    useEffect(() => {
        let filtered = rankedApplicants;
 
        // Apply course filter
        if (selectedCourse === "selected") {
            filtered = rankedApplicants.filter(applicant => selectedApplication.includes(applicant.id));
        } else if (selectedCourse) {
            filtered = filtered.filter(applicant => applicant.course === selectedCourse);
        }

        // Apply search
        filtered = performSearch(filtered);
 
        // Apply sorting
        filtered = sortApplicants(filtered);
 
        setFilteredApplicants(filtered);
    }, [searchString, searchCategory, selectedCourse, rankedApplicants, selectedApplication, sortBy, sortOrder]);
 
    //This handles toggling the selection state of an applicant
    const handleSelectApplicant = async (applicant: Applicant) => {

        //TODO: Fix this bug. to implement API to check if candidate is already selected.


        // if (!lecturerId) return;
        // try {
        //     const result = await handleCandidateSelection(lecturerId, applicant.id);
        //     setSelectedApplication(prev => {
        //         if (result.selected) {
        //             return [...prev, applicant.id];
        //         } else {
        //             return prev.filter(id => id !== applicant.id);
        //         }
        //     });
        // } catch (error) {
        //     console.error('Failed to toggle candidate selection', error);
        // }
        // const exists = selectedApplication.some(a => a === applicant.id);
 
        // const updatedApplicants = rankedApplicants.map(a => {
        //     if (a.id === applicant.id) {
        //         const updatedCount = exists ? (a.totalSelected || 0) - 1 : (a.totalSelected || 0) + 1;
        //         return { ...a, totalSelected: Math.max(updatedCount, 0) };
        //     }
        //     return a;
        // });
 
        // setRankedApplicants(updatedApplicants);
        // setSelectedApplication(exists ? selectedApplication.filter(a => a !== applicant.id) : [...selectedApplication, applicant.id]);
    };
 
    //Drag and drop functionality
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const updated = Array.from(filteredApplicants);
        const [moved] = updated.splice(result.source.index, 1);
        updated.splice(result.destination.index, 0, moved);
        const reRanked = updated.map((a, i) => ({ ...a, rank: i + 1 }));
        
        setFilteredApplicants(reRanked);
        setRankedApplicants(prev => {
            const newRanked = [...prev];
            reRanked.forEach(ranked => {
                const index = newRanked.findIndex(a => a.id === ranked.id);
                if (index !== -1) {
                    newRanked[index] = ranked;
                }
            });
            return newRanked;
        });
    };
 
    const handleCommentBlur = async (applicationId: number, newComment: string) => {
        if (!lecturerId) return;

        // Update local state
        setComments(prevComments => {
            const newComments = [...prevComments];
            const commentIndex = newComments.findIndex(
                c => c.lecturerId === lecturerId && c.applicantId === applicationId
            );
            if (commentIndex > -1) {
                newComments[commentIndex] = {
                    ...newComments[commentIndex],
                    comment: newComment
                };
            } else {
                newComments.push({ lecturerId, applicantId: applicationId, comment: newComment });
            }
            return newComments;
        });

        // Save to backend
        try {
            await saveComment(lecturerId, applicationId, newComment);
        } catch (error) {
            console.error('Failed to save comment:', error);
        }
    };
 
    const getComment = (applicantId: number) => {
        const commentObj = comments.find(
            c => c.lecturerId === lecturerId && c.applicantId === applicantId
        );
        return commentObj ? commentObj.comment : "";
    };
 
    //Selection labels
    const getSelectionLabel = (applicant: Applicant) => {
        if (!applicant.totalSelected || applicant.totalSelected === 0) return "Has not been selected yet";
 
        const selectedRankedApplicants = selectedCourse === "selected" ? rankedApplicants : rankedApplicants;
        const nonZeroSelections = selectedRankedApplicants.filter(a => a.totalSelected > 0);
        const maxSelected = Math.max(...selectedRankedApplicants.map(a => a.totalSelected || 0));
        const minSelected = nonZeroSelections.length > 0 ? Math.min(...nonZeroSelections.map(a => a.totalSelected || 0)) : 0;
 
        if (applicant.totalSelected === maxSelected) return "Most selected! *";
        if (applicant.totalSelected === minSelected) return "Least selected!";
        return "";
    };

    const handleCommentEdit = (applicationId: number) => {
        setEditCommentId(applicationId);
    };

    // Update applicants' selected state when selectedApplicationIds changes
    useEffect(() => {
        setFilteredApplicants(prevApplicants =>
            prevApplicants.map(applicant => ({
                ...applicant,
                selected: selectedApplication.includes(applicant.id)
            }))
        );
    }, [selectedApplication]);

    return (
        <Box>
            <Navbar />
            <Box className="lecturers-container">
                <Box className="header-section">
                    <Heading className="dashboard-title">
                        Lecturer Dashboard - {"TO ADD"} {"NAME HERE"}
                    </Heading>
                    <Text className="assigned-courses-text">
                    <strong>Assigned Courses:</strong> {lecturerAssignedCourses.map(c => c.course_name).join(", ")}
                    </Text>
                </Box>

                <Divider className="section-divider" />

                <Box className="search-filters-section">
                    <Heading className="section-title">
                        Search & Filter Options
                    </Heading>
                    
                    <VStack className="search-controls">
                        <HStack className="search-row">
                            <Box className="search-input-container">
                                <Text className="control-label">Search Applicants:</Text>
                                <InputGroup>
                                    <InputLeftElement className="search-icon">
                                        <MdSearch />
                                    </InputLeftElement>
                                    <Input
                                        className="search-input"
                                        placeholder="Enter search term..."
                                        onChange={(e) => setSearchString(e.target.value)}
                                        value={searchString}
                                    />
                                </InputGroup>
                            </Box>
                            <Box className="search-category-container">
                                <Text className="control-label">Search In:</Text>
                                <Select 
                                    className="search-category-select"
                                    value={searchCategory} 
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                >
                                    <option value="skills">Skills</option>
                                    <option value="name">Tutor Name</option>
                                    <option value="availability">Availability</option>
                                    <option value="roleApplied">Role Applied</option>
                                </Select>
                            </Box>
                        </HStack>

                        <HStack className="filter-sort-row">
                            <Box className="course-filter-container">
                                <Text className="control-label">Filter by Course:</Text>
                                <Select
                                    className="course-filter-select"
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    value={selectedCourse}
                                >
                                    <option value="">All Assigned Courses</option>
                                    <option value="selected">Selected Applicants Only</option>
                                    {/* {courses.map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))} */}
                                </Select>
                            </Box>
                            <Box className="sort-container">
                                <Text className="control-label">Sort By:</Text>
                                <HStack className="sort-controls">
                                    <Select
                                        className="sort-by-select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="rank">Rank</option>
                                        <option value="course">Course Name</option>
                                        <option value="availability">Availability</option>
                                    </Select>
                                    <Select
                                        className="sort-order-select"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                    >
                                        <option value="asc">↑ Asc</option>
                                        <option value="desc">↓ Desc</option>
                                    </Select>
                                </HStack>
                            </Box>
                        </HStack>
                    </VStack>
                </Box>

                <Divider className="section-divider" />

                <Box className="applicant-list-section">
                    <Heading className="section-title">
                        Applicants List ({filteredApplicants.length} shown)
                    </Heading>
                    
                    {filteredApplicants.length === 0 ? (
                        <Box className="no-applicants">
                            <Text className="no-applicants-main">
                                No applicants found for your assigned courses with current filters
                            </Text>
                            <Text className="no-applicants-sub">
                                Try adjusting your search or filter criteria
                            </Text>
                        </Box>
                    ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="applicants">
                                {(provided) => (
                                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                                        {filteredApplicants.map((applicant, index) => (
                                            <Draggable
                                                key={applicant.application_id ? applicant.application_id.toString() : applicant.id.toString()}
                                                draggableId={applicant.application_id ? applicant.application_id.toString() : applicant.id.toString()}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <Box
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`applicant-card ${
                                                            selectedApplication.includes(applicant.id) ? 'selected' : ''
                                                        } ${snapshot.isDragging ? 'dragging' : ''}`}
                                                    >
                                                        <Flex className="applicant-content">
                                                            <Box className="applicant-info">
                                                                <Badge className={`selection-badge ${
                                                                    getSelectionLabel(applicant).includes("Most") ? 'most-selected' : 
                                                                    getSelectionLabel(applicant).includes("Least") ? 'least-selected' : 'not-selected'
                                                                }`}>
                                                                    {getSelectionLabel(applicant)}
                                                                </Badge>

                                                                <VStack className="applicant-details">
                                                                    <Heading className="applicant-name">
                                                                        {applicant.name}
                                                                    </Heading>
                                                                    <Text className="detail-item"><strong>Course:</strong> {applicant.appliedCourse}</Text>
                                                                    <Text className="detail-item"><strong>Academic Credentials:</strong> {applicant.credentials.join(", ")}</Text>
                                                                    <Text className="detail-item"><strong>Skills:</strong> {applicant.skills.join(", ")}</Text>
                                                                    <Text className="detail-item"><strong>Previous Roles:</strong> {applicant.prevRoles.join(", ")}</Text>
                                                                    <Text className="detail-item"><strong>Role Applied:</strong> {getRoleDisplay(applicant.roleApplied)}</Text>
                                                                    <Text className="detail-item"><strong>Availability:</strong> 
                                                                        <Badge className={`availability-badge ${applicant.availabilityType.toLowerCase() === "full time" ? 'full-time' : 'part-time'}`}>
                                                                            {applicant.availabilityType}
                                                                        </Badge>
                                                                    </Text>
                                                                </VStack>

                                                                <Box className="comments-section">
                                                                    <Text className="comments-label">Comments:</Text>
                                                                    {editCommentId === applicant.id ? (
                                                                        <VStack className="comment-edit-container">
                                                                            <Textarea
                                                                                className="comment-textarea"
                                                                                value={getComment(applicant.id) || ""}
                                                                                onChange={(e) => {
                                                                                    setComments(prevComments => {
                                                                                        const newComments = [...prevComments];
                                                                                        const commentIndex = newComments.findIndex(
                                                                                            c => c.lecturerId === lecturerId && c.applicantId === applicant.id
                                                                                        );
                                                                                        if (commentIndex > -1) {
                                                                                            newComments[commentIndex] = {
                                                                                                ...newComments[commentIndex],
                                                                                                comment: e.target.value
                                                                                            };
                                                                                        } else {
                                                                                            newComments.push({ lecturerId, applicantId: applicant.id, comment: e.target.value });
                                                                                        }
                                                                                        return newComments;
                                                                                    });
                                                                                }}
                                                                                placeholder="Add your comments about this candidate..."
                                                                                rows={3}
                                                                                autoFocus
                                                                            />
                                                                            <HStack className="comment-buttons">
                                                                                <Button 
                                                                                    className="save-comment-btn"
                                                                                    onClick={() => handleCommentBlur(applicant.id, getComment(applicant.id))}
                                                                                >
                                                                                    Save Comment
                                                                                </Button>
                                                                                <Button 
                                                                                    className="cancel-comment-btn"
                                                                                    onClick={() => setEditCommentId(null)}
                                                                                >
                                                                                    Cancel
                                                                                </Button>
                                                                            </HStack>
                                                                        </VStack>
                                                                    ) : (
                                                                        <Box
                                                                            className="comment-display"
                                                                            onClick={() => handleCommentEdit(applicant.id)}
                                                                        >
                                                                            <Text className={`comment-text ${getComment(applicant.id) ? 'has-comment' : 'no-comment'}`}>
                                                                                {getComment(applicant.id) || "Click to add comments..."}
                                                                            </Text>
                                                                        </Box>
                                                                    )}
                                                                </Box>

                                                                <HStack className="action-buttons">
                                                                    <Button
                                                                        className={`select-btn ${selectedApplication.includes(applicant.id) ? 'deselect' : 'select'}`}
                                                                        onClick={() => handleSelectApplicant(applicant)}
                                                                    >
                                                                        {selectedApplication.includes(applicant.id) ? "✗ Deselect" : "✓ Select Candidate"}
                                                                    </Button>
                                                                    <Badge className="selection-count">
                                                                        Selected {applicant.totalSelected} times
                                                                    </Badge>
                                                                </HStack>
                                                            </Box>

                                                            <VStack className="ranking-controls">
                                                                <Text className="rank-label">RANK</Text>
                                                                <IconButton
                                                                    className="rank-btn up"
                                                                    icon={<MdArrowUpward />}
                                                                    aria-label="Move Up"
                                                                    isDisabled={index === 0}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (index > 0) {
                                                                            const updated = Array.from(filteredApplicants);
                                                                            const [moved] = updated.splice(index, 1);
                                                                            updated.splice(index - 1, 0, moved);
                                                                            const reRanked = updated.map((a, i) => ({ ...a, rank: i + 1 }));
                                                                            setFilteredApplicants(reRanked);
                                                                        }
                                                                    }}
                                                                />
                                                                <Text className="rank-number">
                                                                    {applicant.rank}
                                                                </Text>
                                                                <IconButton
                                                                    className="rank-btn down"
                                                                    icon={<MdArrowDownward />}
                                                                    aria-label="Move Down"
                                                                    isDisabled={index === filteredApplicants.length - 1}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (index < filteredApplicants.length - 1) {
                                                                            const updated = Array.from(filteredApplicants);
                                                                            const [moved] = updated.splice(index, 1);
                                                                            updated.splice(index + 1, 0, moved);
                                                                            const reRanked = updated.map((a, i) => ({ ...a, rank: i + 1 }));
                                                                            setFilteredApplicants(reRanked);
                                                                        }
                                                                    }}
                                                                />
                                                                <Text className="drag-hint">
                                                                    Drag to reorder
                                                                </Text>
                                                            </VStack>
                                                        </Flex>
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default Lecturers;