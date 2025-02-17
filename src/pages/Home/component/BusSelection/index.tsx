// 스타일
import {
    Content,
    Detail,
    Info,
    LeftButton, RightButton,
    SvgContainer,
    Title,
    Wrapper
} from "@/pages/Home/component/BusSelection/styles.ts";
// 컴포넌트
import BusSelectionIconA from "@/components/designSystem/Icons/Home/BusSelectionIconA.tsx";
import BusSelectionIconB from "@/components/designSystem/Icons/Home/BusSelectionIconB.tsx";
import {useNavigate} from "react-router-dom";


export default function BusSelection() {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <LeftButton onClick={() => {
                navigate('/custom-bus-booking')
            }}>
                <Content>
                    <Info>
                        <Title>
                            버스 예약
                        </Title>
                        <Detail>
                            집 앞까지 오는 버스
                        </Detail>
                    </Info>
                    <SvgContainer>
                        <BusSelectionIconA/>
                    </SvgContainer>
                </Content>
            </LeftButton>
            <RightButton onClick={() => {
                navigate('/fixed-bus-booking')
            }}>
                <Content>
                    <Info>
                        <Title>
                            함께 타기
                        </Title>
                        <Detail>
                            출발이 확정된 버스
                        </Detail>
                    </Info>
                    <SvgContainer>
                        <BusSelectionIconB/>
                    </SvgContainer>
                </Content>
            </RightButton>
        </Wrapper>
    );
}