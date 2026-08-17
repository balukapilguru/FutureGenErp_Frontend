
import "./LoadingScreen.css"
const LoadingScreen = () => {
    const text1 = "Future";
    const text2 = "Gen";
    return (
        <div className="wrapper">
            <div className="text-part">
                {text1.split('').map((char, index) => (
                    <span key={index} className="animated-char orange" style={{ animationDelay: `${index * 0.1}s` }}>
                        {char}
                    </span>
                ))}
            </div>
            <div className="gap">
{" "}
            </div>
 
            <div className="text-part">
                {text2.split('').map((char, index) => (
                    <span key={index} className="animated-char blue" style={{ animationDelay: `${(text1.length + 1 + index) * 0.1}s` }}>
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
 
};
 
 
 
export default LoadingScreen;
 
