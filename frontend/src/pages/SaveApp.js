import CustomLayout from "../components/customLayout";
import { Box, Typography, Divider } from "@mui/material";

const InstructionBlock = ({ title, steps }) => (
    <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {title}
        </Typography>
        {steps.map((step, index) => (
            <Typography key={index} sx={{ mt: 1 }}>
                {index + 1}. {step}
            </Typography>
        ))}
    </Box>
);

const SaveApp = () => {
    const instructions = [
        {
            title: "iPhone",
            steps: [
                "Open the app in Chrome.",
                "Tap the Share button (the square icon with an arrow pointing upward).",
                "Scroll down and select Add to Home Screen.",
                "Tap Add, and the app will appear on your home screen."
            ]
        },
        {
            title: "Android",
            steps: [
                "Open the app in Chrome.",
                "Tap the three-dot menu (top-right corner).",
                "Select Add to Home screen.",
                "Follow the prompts to add the app to your home screen."
            ]
        },
        {
            title: "PC",
            steps: [
                "Open the app in Chrome.",
                "Click the three-dot menu (top-right corner).",
                "Select Install App or Create Shortcut.",
                "Follow the prompts to install or create a desktop shortcut."
            ]
        }
    ];

    return (
        <CustomLayout >
            <Box>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                    Instructions to add RepVision to Homescreen
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {instructions.map((instruction, index) => (
                    <InstructionBlock
                        key={index}
                        title={instruction.title}
                        steps={instruction.steps}
                    />
                ))}
            </Box>
        </CustomLayout>
    );
};

export default SaveApp;
