
import {Modal } from 'antd';

interface Props {
  open: boolean;
  handleClose: () => void;
  children: JSX.Element;
  showDowndrop?: boolean;
}

export default function ModalPopup({
  children,
  open,
  handleClose,
  showDowndrop,
}: Props) {
  
  return (
    <Modal open={open} onCancel={handleClose} className='w-fit' wrapClassName="text-white" centered={true} footer={null}>
        <div
          className={`rounded-lg ${
            showDowndrop
              ? "w-[17rem] p-2 top-[13rem]"
              : `w-auto px-6 py-6 top-[50%]`
          }  bg-white dark:bg-secondary 
            rounded-lg h-auto overflow-auto md:overflow-hidden`}
        >
          {children}
        </div>

    </Modal>
  );
}
