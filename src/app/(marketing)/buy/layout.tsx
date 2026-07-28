import FooterSection from "../components/FooterSection";
import Navbar from "../components/Navbar";

export default function layout({ children }: { children: React.ReactNode}) {

    return(
        <div>
            <Navbar />
            {children}
            <FooterSection/>
        </div>
    )
}