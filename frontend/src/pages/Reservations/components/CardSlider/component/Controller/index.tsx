import {ScheduledDepartures} from "@/pages/Reservations/components/CardSlider/styles.ts";
import ArrowLeftIcon from "@/components/designSystem/Icons/Reservations/ArrowLeftIcon.tsx";
import ArrowRightIcon from "@/components/designSystem/Icons/Reservations/ArrowRightIcon.tsx";


interface ControllerProps {
    contentsLength: number
    currentNum: number
    slidePrev: () => void
    slideNext: () => void

}
export default function Controller({contentsLength, currentNum, slidePrev, slideNext}: ControllerProps) {
    return (
        <>
            {
                contentsLength > 0 &&
                <ScheduledDepartures.SliderControls>
                    {
                        contentsLength > 1 ?
                            <ScheduledDepartures.SlideButton onClick={slidePrev}>
                                <ArrowLeftIcon />
                            </ScheduledDepartures.SlideButton>:
                            null
                    }
                    <ScheduledDepartures.SlideCounter isCurrent={true}>
                        {currentNum + 1}
                    </ScheduledDepartures.SlideCounter>
                    <ScheduledDepartures.SlideCounter>
                        /
                    </ScheduledDepartures.SlideCounter>
                    <ScheduledDepartures.SlideCounter>
                        {contentsLength}
                    </ScheduledDepartures.SlideCounter>
                    {
                        contentsLength > 1 ?
                            <ScheduledDepartures.SlideButton onClick={slideNext}>
                                <ArrowRightIcon />
                            </ScheduledDepartures.SlideButton> :
                            null
                    }
                </ScheduledDepartures.SliderControls>
            }
        </>
    )
}