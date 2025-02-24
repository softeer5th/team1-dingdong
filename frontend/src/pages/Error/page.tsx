import Modal from "@/components/Modal";
import {useNavigate} from "react-router-dom";

export default function Page() {
    const navigate = useNavigate();

    return (
        <Modal
            title={["🔍 404 Not Found:", "없는 페이지 입니다"]}
            text={["홈 페이지로 이동하겠습니다."]}
            isError={true}
            leftButton={{text: "확인", onClick: () => navigate("/")}}/>
    );
}
