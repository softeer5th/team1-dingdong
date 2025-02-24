
// 스타일
import {
    Detail,
    ReserveButton,
    ReserveButtonText,
    TextBox,
    Wrapper,
    Title
} from "@/pages/Home/component/BusState/component/BusReservation/styles.ts";
import {useNavigate} from "react-router-dom";



export default function BusReservation() {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <TextBox>
                <Title>
                    등하교 버스를 예매해볼까요?
                </Title>
                <Detail>
                    아직 예매 내역이 없어요!
                </Detail>
            </TextBox>
            <ReserveButton onClick={() => {
                navigate('/custom-bus-booking')
            }}>
                <ReserveButtonText>
                    예매하러 가기
                </ReserveButtonText>
            </ReserveButton>
        </Wrapper>
    )
}