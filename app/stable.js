import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { Entypo, AntDesign, FontAwesome } from "@expo/vector-icons";

const imagesApiUrl = "https://in-the-know.blobsandtrees.online/wp-json/wp/v2/media";
const questionsApiUrl = "https://in-the-know.blobsandtrees.online/wp-json/custom/v1/question-posts";
const updateRepeatedApiUrl = "https://in-the-know.blobsandtrees.online/wp-json/custom/v1/update-repeated/";
const updateQuestionApiUrl = "https://in-the-know.blobsandtrees.online/wp-json/custom/v1/update-question/";

const TestIt = () => {
    const [showAnswer, setShowAnswer] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [randomImageIndex, setRandomImageIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [numberOfCurrentQuestion, setNumberOfCurrentQuestion] = useState(1);
    const [notice, setNotice] = useState("");
    const [questionInput, setQuestionInput] = useState("");
    const [answerInput, setAnswerInput] = useState("");
    const [displayQuestionInput, setDisplayQuestionInput] = useState(false);
    const [displayAnswerInput, setDisplayAnswerInput] = useState(false);


    useEffect(() => {
        fetch(imagesApiUrl)
            .then((response) => response.json())
            .then((data) => {
                const imageUrls = data.map((item) => ({ uri: item.source_url }));
                setImages(imageUrls);
            })
            .catch((error) => console.error("Error fetching images:", error));
        
        fetch(questionsApiUrl)
            .then((response) => response.json())
            .then((posts) => {
                const filteredQuestions = posts.filter((question) => question?.question);
                const sortedQuestions = sortQuestionsByRepeated(filteredQuestions);
                setQuestions(shuffleArray(sortedQuestions));
            })
            .catch((error) => console.error(error));
    }, []);

    const sortQuestionsByRepeated = (questions) => {
        const minRepeat = Math.min(...questions.map((question) => Number(question.repeated)));
        const maxRepeat = Math.max(...questions.map((question) => Number(question.repeated)));
        const thresholds = Array.from({ length: maxRepeat - minRepeat + 1 }, (_, i) => i + minRepeat);

        console.log(minRepeat, maxRepeat, thresholds);
    
        const groupedQuestions = thresholds.map((threshold) =>
          questions.filter((question) => (Number(question.repeated) || 0) === threshold)
        );
    
        return groupedQuestions.flat();
      };

    const shuffleArray = (array) => {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };

    const handleGoPress = () => {
        setNotice("");
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
            setRandomImageIndex(Math.floor(Math.random() * images.length));
            setNumberOfCurrentQuestion(numberOfCurrentQuestion + 1);
            setShowAnswer(false);
        } else {
            setCurrentIndex(0);
            setNumberOfCurrentQuestion(1);
        }

        setDisplayQuestionInput(false);
        setDisplayAnswerInput(false);
    };

    const handleSeeAnswerPress = async () => {
        setNotice("");
        setShowAnswer(true);
        const updatedRepeated = (Number(questions[currentIndex].repeated) || 0) + 1;
        questions[currentIndex].repeated = updatedRepeated;
        try {
            await fetch(updateRepeatedApiUrl + questions[currentIndex].id, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ new_repeated: updatedRepeated })
            });

            setDisplayQuestionInput(false);
            setDisplayAnswerInput(false);
        } catch (error) {
            console.error("Error updating repeated count:", error);
        }
    };

    const handleSavePress = async () => {
        const updatedQuestion = questionInput || questions[currentIndex].question;
        const updatedAnswer = answerInput || questions[currentIndex].answer;
        try {
            const response = await fetch(updateQuestionApiUrl + questions[currentIndex].id, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: updatedQuestion, answer: updatedAnswer })
            });
            if (!response.ok) throw new Error('Failed to update question');
            setNotice("Question updated successfully!");
            questions[currentIndex].question = updatedQuestion;
            questions[currentIndex].answer = updatedAnswer;
            setQuestionInput("");
            setAnswerInput("");
        } catch (error) {
            console.error("Error updating question:", error);
            setNotice("Error updating question!");
        }
    };

    const renderCard = () => {
        return (
            <View style={styles.card}>
                {!displayQuestionInput && 
                    <TouchableOpacity onPress={() => setDisplayQuestionInput(true)}>
                        <Text style={styles.cardText}>
                            {questionInput || questions[currentIndex]?.question}
                        </Text>
                    </TouchableOpacity>
                }
                {displayQuestionInput && 
                    <TextInput
                    style={[styles.cardText, showAnswer ? styles.hidden : null]}
                    value={questions[currentIndex]?.question}
                    onChangeText={setQuestionInput}
                    editable={!showAnswer}
                    multiline
                    />
                }

                {(showAnswer && !displayAnswerInput) && 
                    <TouchableOpacity onPress={() => setDisplayAnswerInput(true)}>
                        <hr></hr>
                        <Text style={styles.cardText}>
                            {questions[currentIndex]?.answer}
                        </Text>
                    </TouchableOpacity>
                }
                
                {(showAnswer && displayAnswerInput) && (
                    <>
                        <TextInput
                            style={styles.cardText}
                            value={answerInput || questions[currentIndex]?.answer}
                            onChangeText={setAnswerInput}
                            multiline
                        />
                    </>
                )}
                <View style={styles.buttonContainer}>
                    {showAnswer ? (
                        <TouchableOpacity onPress={handleGoPress} style={styles.goButton}>
                            <Entypo name="forward" size={34} color="white" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleSeeAnswerPress} style={styles.seeAnswerButton}>
                            <Entypo name="eye" size={34} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.repeatedText}>
                    repeated: {questions[currentIndex]?.repeated || 0}
                </Text>
                {(displayQuestionInput || displayAnswerInput) && 
                    <TouchableOpacity onPress={handleSavePress} style={styles.saveButton}>
                        <FontAwesome name="save" size={24} color="white" />
                    </TouchableOpacity>
                }
                <Text style={styles.questionCount}>
                    {numberOfCurrentQuestion} / {questions.length}
                </Text>
                {notice ? <Text style={styles.notice}>{notice}</Text> : null}
            </View>
        );
    };

    return (
        <ImageBackground
            source={{ uri: images[randomImageIndex]?.uri }}
            resizeMode="cover"
            style={styles.container}
        >
            <Stack.Screen
                options={{
                    headerTintColor: "#fff",
                    headerTitleStyle: { fontWeight: "bold" },
                    headerTitle: "Test it",
                }}
            />
            <View style={styles.grid}>{renderCard()}</View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", width: 300 },
    card: {
        width: 320,
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e91e63",
        margin: 5,
        padding: 12,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 10,
        borderRadius: 4,
    },
    cardText: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    hidden: { display: 'none' },
    repeatedText: { color: "white", marginTop: 10 },
    saveButton: {
        marginTop: 10,
        padding: 8,
        backgroundColor: "aqua",
        borderRadius: 4,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "center",
        width: "100%",
    },
    goButton: {
        backgroundColor: "aqua",
        padding: 8,
        borderRadius: 400,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    seeAnswerButton: {
        backgroundColor: "aqua",
        padding: 8,
        borderRadius: 400,
        justifyContent: "center",
        alignItems: "center",
    },
    questionCount: {
        color: "white",
        marginTop: 10,
    },
    notice: {
        color: "white",
        marginTop: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 5,
        borderRadius: 4,
    },
});

export default TestIt;
