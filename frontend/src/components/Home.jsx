import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import HeroSection from "./Home Components/HeroSection";
import ProblemSection from "./Home Components/ProblemSection";
import HowItWorks from "./Home Components/HowItworks";
import Features from "./Home Components/Features";



function Home() {
    return (
        <>
        <Navbar />
        <HeroSection />
        <ProblemSection />
        <HowItWorks />
        <Features />
        <Footer />
        </>  
        
    );
}

export default Home;