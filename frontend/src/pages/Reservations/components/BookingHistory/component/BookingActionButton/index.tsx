import {ActionButton, ActionText} from "./styles.ts";
import {mountModal} from "@/components/Loading";
import Modal from "@/components/Modal";



type BookingHistoryProps = {
    disabled?: boolean;
    onClick?: () => void;
}
export default function BookingActionButton({disabled = false, onClick}: BookingHistoryProps) {

    const renderModal = () => {
        const {render, unmountModal} = mountModal()
        render(<Modal
            title={['예매를 취소하시겠어요?']}
            text={['취소 수수료는 무료이며,','환불은 24시간 이내에 진행돼요.']}
            leftButton={{text: '아니요', onClick: unmountModal}}
            rightButton={{text: '취소하기', onClick: () => {
                if (onClick) {
                    onClick()
                }
                unmountModal()
            }}}/>)
    }

    return (
        <ActionButton disabled={disabled} onClick={renderModal}>
            <ActionText disabled={disabled}>
                예매 취소
            </ActionText>
        </ActionButton>
    )
}