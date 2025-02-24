import {ToastWrapper} from "@/components/Toast/styles.ts";


interface ToastProps {
    message: string;
    bottom: string;
}
export default function Toast({message, bottom}: ToastProps) {

    return (
        <ToastWrapper translateY={bottom}>
            <span>
                {message}
            </span>
        </ToastWrapper>
    )
}