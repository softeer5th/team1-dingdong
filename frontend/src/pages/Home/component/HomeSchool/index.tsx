// 스타일
import {Content, Row, Wrapper, Text, Title, Divider, SvgBox} from "@/pages/Home/component/HomeSchool/styles.ts";
// 컴포넌트
import HomeIcon from "@/components/designSystem/Icons/HomeIcon.tsx";
import ArrowRightIcon from "@/components/designSystem/Icons/Home/ArrowRightIcon.tsx";
import UniversityIcon from "@/components/designSystem/Icons/Home/UniversityIcon.tsx";
import {useNavigate} from "react-router-dom";


interface HomeSchoolProps {
    stationName: string;
    schoolName: string;
}
export default function HomeSchool({stationName, schoolName}: HomeSchoolProps) {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <Content as={'button'}  onClick={() => {
                navigate('/set-home-location')
            }}>
                <Row>
                    <HomeIcon/>
                    <Text>
                        탑승 위치
                    </Text>
                    <SvgBox>
                        <ArrowRightIcon/>
                    </SvgBox>
                </Row>
                <Title>
                    {stationName}
                </Title>
            </Content>
            <Divider/>
            <Content>
                <Row>
                    <UniversityIcon/>
                    <Text>
                        학교
                    </Text>
                </Row>
                <Title>
                    {schoolName}
                </Title>
            </Content>
        </Wrapper>
    );
}