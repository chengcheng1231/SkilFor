import styled from "styled-components";
import {
  AlertContainer,
  AlertTitle,
  AlertContent,
  AlertButton,
  CloseButton,
} from "./AddTaskAlertCard";
import close from "../../img/close.png";
import { deleteCalendarEvent } from "../../WebAPI";
import {
  TimeTitle,
  TimeContainer,
} from "../../pages/FrontCoursePage/components/ReserveAlertCard";

const ContentContainer = styled.div``;

const WrapContent = styled(AlertContent)`
  overflow-wrap: break-word;
`;
const getDisplayDate = (dateObj) => {
  let dateStr = dateObj.toLocaleString();
  console.log(dateStr);
  return dateStr.slice(0, dateStr.length - 3);
};

function ReadTaskAlertCard({
  allEvents,
  setAllEvents,
  setAlertShow,
  selectedEvent,
  setApiError,
}) {
  console.log(selectedEvent);
  const handleCloseClick = () => {
    setAlertShow(null);
  };
  const handleDeleteEvent = (selectedEvent) => {
    let confirmAlert;
    if (selectedEvent.resource.reserved) {
      confirmAlert = window.confirm(
        "確定取消此時段的課程嗎？系統將通知預約的學生您已取消這堂課！"
      );
    } else {
      confirmAlert = window.confirm("確定刪除此時段的課程嗎？");
    }
    if (!confirmAlert) return;
    deleteCalendarEvent(setApiError, selectedEvent.id).then((json) => {
      if (!json || !json.success) return setApiError("課程時間刪除失敗");
      setAllEvents(allEvents.filter((event) => event.id !== selectedEvent.id));
    });
    setAlertShow(false);
  };
  return (
    <AlertContainer color="#75A29E">
      <CloseButton src={close} onClick={handleCloseClick} />
      <AlertTitle>{selectedEvent.title}</AlertTitle>
      <TimeContainer>
        <TimeTitle>開始：{getDisplayDate(selectedEvent.start)}</TimeTitle>
        <TimeTitle>結束：{getDisplayDate(selectedEvent.end)}</TimeTitle>
      </TimeContainer>
      <ContentContainer>
        {selectedEvent.resource.reserved ? (
          <AlertContent>
            預約學生：{selectedEvent.resource.reserved}
          </AlertContent>
        ) : (
          <AlertContent>預約狀態：尚無人預約</AlertContent>
        )}
        {selectedEvent.resource.studentNotes && (
          <WrapContent>
            學生備註：{selectedEvent.resource.studentNotes}
          </WrapContent>
        )}
        <AlertButton
          color="#75A29E"
          onClick={() => handleDeleteEvent(selectedEvent)}
        >
          {selectedEvent.resource.reserved ? "取消此時段" : "刪除此時段"}
        </AlertButton>
      </ContentContainer>
    </AlertContainer>
  );
}

export default ReadTaskAlertCard;
