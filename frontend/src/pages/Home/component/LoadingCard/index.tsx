import {useEffect, useRef, useState} from "react";
import LoadingSpinner from "@/components/designSystem/Icons/LoadingSpinner.tsx";
import {Wrapper} from "@/pages/Home/component/LoadingCard/styles.ts";


interface LoadingCardProps {
    getNextBusState: (errorCallbackF: Function) => void;
}
export default function LoadingCard({getNextBusState}: LoadingCardProps) {
    const ref = useRef(null)
    const [isError, setIsError] = useState<boolean>(false);


    useEffect(() => {

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    getNextBusState(() => setIsError(true));
                }
            },
            { threshold: 0.0 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [getNextBusState]);


    return (
        <Wrapper ref={ref}>
            {
                isError ?
                    <button onClick={() => {
                        setIsError(false)
                        getNextBusState(() => setIsError(true))
                    }}>
                        <span>불러오기 실패 (클릭하여 다시 시도)</span>
                    </button> :
                    <LoadingSpinner />
            }
        </Wrapper>
    )
}