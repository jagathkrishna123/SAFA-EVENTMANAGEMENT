import { NavBar } from "./NavBar/navBar";
import { LandingPage } from "./LandingPage/LandingPage";
import { UpcomingEvents } from "./UpcomingEvents/UpcomingEvents";
import OurPrograms from "./OurPrograms/OurPrograms";
export function Display() {

    return (
        <>
            <div className=" flex flex-wrap w-full">

                {/* <div className="w-full">
                    <NavBar />
                </div> */}
                <div className="w-full">
                    <LandingPage/>
                    <UpcomingEvents/>
                    <OurPrograms/>
                    
                </div>

            </div>
        </>
    )
}