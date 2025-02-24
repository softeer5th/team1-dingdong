import PopHeader from "@/components/Headers/PopHeader";
import DingDongCard from "@/pages/Payment/components/DingDongCard";
import {

    ButtonBox, ButtonText,
    CardBox,
    Main,
    PageDivider,
    PageWrapper,
    RechargeButton,
    SendButton,
    SubTitle,
    Title
} from "@/pages/Wallet/styles.ts";
import {colors} from "@/styles/colors.ts";
import useToast from "@/hooks/useToast";
import {useLoaderData, useRevalidator} from "react-router-dom";
import {users_wallet_history_interface} from "@/api/query/users";
import HistoryList from "@/pages/Wallet/component/HistoryList";
import {actFreeCharge} from "@/pages/Wallet/utils/actFreeCharge.ts";


export default function Page() {
    const addToast = useToast();
    const [histories]: [users_wallet_history_interface] = useLoaderData()
    const { revalidate, state } = useRevalidator()


    return (
        <PageWrapper>
            <PopHeader text={"결제 수단 관리"} />
            <Main>
                <Title>
                    딩동머니 관리
                </Title>
                <SubTitle>
                    결제 및 입금 내역을 확인하세요!
                </SubTitle>
                <CardBox>
                    <DingDongCard />
                </CardBox>
                <ButtonBox>
                    <SendButton onClick={() => addToast("현재 지원하지 않는 기능입니다.")}>
                        <ButtonText color={colors.gray90}>
                            딩동 머니 충전
                        </ButtonText>
                    </SendButton>
                    <RechargeButton onClick={() => actFreeCharge(revalidate, addToast, state)}>
                        <ButtonText color={colors.gray0}>
                            딩동 머니 무료 충전
                        </ButtonText>
                    </RechargeButton>
                </ButtonBox>
                <PageDivider />
                <HistoryList histories={histories.histories} />
            </Main>
        </PageWrapper>
    )

}

