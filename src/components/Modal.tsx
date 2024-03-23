import { Modal } from "antd";

interface Props {
  open: boolean;
  handleClose: () => void;
  children: JSX.Element;
}

export default function ModalPopup({ children, open, handleClose }: Props) {
  return (
    <Modal
      open={open}
      onCancel={()=>handleClose()}
      className="w-fit"
      centered={true}
      footer={null}
      
    >
      <div
        className={`rounded-lg 
              w-auto px-6 pb-6 pt-8 top-[50%] bg-white dark:bg-secondary 
            rounded-lg h-auto overflow-auto md:overflow-hidden`}
      >
        {children}
      </div>
    </Modal>
  );
}
