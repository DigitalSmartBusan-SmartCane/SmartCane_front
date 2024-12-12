import React, { useEffect, useState, useContext } from "react";
import Menubar from "../component/Menu_component";
import { WebSocketContext } from "../contexts/WebSocketContext";
import "./MMS.css";

function MMSPage() {
  const [registrations, setRegistrations] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relations, setRelations] = useState([]);
  const { heartbeat } = useContext(WebSocketContext);

  // 데이터베이스에서 정보 가져오기 (API 호출)
  const fetchRegistrations = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/registrations");
      ;
      const data = await response.json();
      setRegistrations(data);
      setRelations(data.map((item) => item.relation || "")); // 초기 관계 설정
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    if (!name || !phone) {
      alert("이름과 전화번호를 모두 입력해주세요.");
      return;
    }

    const newRegistration = { name, phone };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRegistration),
      });
      if (response.ok) {
        alert("등록 성공!");
        fetchRegistrations(); // 데이터 갱신
      } else if (response.status === 409) {
        // 중복된 전화번호 오류 처리
        const errorData = await response.json();
        alert(`${errorData.detail}`);
      } else if (response.status === 422) {
        // 유효성 검사 실패 처리
        const errorData = await response.json();
        alert(`${errorData.detail}`);
      } else {
        alert("등록에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("서버 오류로 인해 등록에 실패했습니다.");
    }
  

    setName("");
    setPhone("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/register/registrations/${id}`, {
        method: "DELETE",
      });
      

      if (response.ok) {
        alert("삭제 완료!");
        // 삭제 후 목록 갱신
        setRegistrations(registrations.filter((item) => item.id !== id));
        setRelations(relations.filter((_, index) => registrations[index]?.id !== id));
      } else {
        throw new Error("Failed to delete registration");
      }
    } catch (error) {
      console.error("Error deleting registration:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  // 관계 변경 핸들러
  const handleRelationChange = async (index, value) => {
    const updatedRelations = [...relations];
    updatedRelations[index] = value; // 관계 배열 업데이트
    setRelations(updatedRelations);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/registrations/relation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: registrations[index].id, // 현재 관계를 업데이트할 ID
          relation: value, // 새 관계 값
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating relation:", errorData.detail);
        alert("관계 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating relation:", error);
      alert("서버 오류로 인해 관계 업데이트에 실패했습니다.");
    }
  };
  


  return (
    <div className="mms-page">
      <div><Menubar /></div>

      <div className="mms-container">
        <div className="mms-section">
          <h3>MMS 알림 번호 등록</h3>
          <div className="mms-form1">
            <label>이름</label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mms-form2">
            <label>전화번호</label>
            <input
              type="text"
              placeholder="전화번호를 입력하세요"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button className="save-btn" onClick={handleSave}>저장</button>
          </div>
        </div>

        <div className="mms-section-list">
          <h3>MMS 알림 핸드폰 등록 목록</h3>
          <div className="mms-list">
            {registrations.map((item, index) => (
              <div key={item.id} className="mms-row">
                <label>이름</label>
                <input type="text" value={item.name} readOnly className="name-input" />

                <label>관계</label>
                <select
                  className="relation-select"
                  value={relations[index] || ""}
                  onChange={(e) => handleRelationChange(index, e.target.value)}
                >
                  <option value="">선택안함</option>
                  <option value="부모">부모</option>
                  <option value="형제자매">형제자매</option>
                  <option value="친구">친구</option>
                  <option value="동료">동료</option>
                  <option value="기타">기타</option>
                </select>

                <label>핸드폰번호</label>
                <input type="text" value={item.phone} readOnly className="phone-input" />
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}>
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MMSPage;
