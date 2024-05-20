import {
  useField,
  FieldHookConfig,
  FieldArrayRenderProps,
  Field,
} from "formik";
import { MdClose } from "react-icons/md";
import { IoAlertCircleOutline } from "react-icons/io5";

interface LabelProps {
  label: string;
  subLabel?:string
}

interface OtherProps {
  index: number;
  arrayHelpers: FieldArrayRenderProps;
}

interface DisplayProps {
  label: string;
  value: string;
  style?:any
}

export const TextInput = ({
  label,
  subLabel,
  ...props
}: LabelProps & FieldHookConfig<string>) => {
  const [field, meta] = useField(props);
  return (
    <div className="relative py-1">
      <label
        className="font-medium text-[15px]"
        htmlFor={props.id || props.name}
      >
        {label} <span className="text-gray/70 text-xs">{ subLabel}</span>
      </label>
      <Field
        {...field}
        {...props}
        
        className={`${
          meta.error ? "border-error/70 border-solid" : null
        } px-4 py-4 w-full mt-2 rounded-md outline-none placeholder:text-xs`}
      />
      {meta.error ? (
        <div className="absolute -bottom-3 text-error/70 text-xs flex items-center gap-x-1">
         <IoAlertCircleOutline/> {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export const TextArea = (
  props: (LabelProps & FieldHookConfig<string>) | any
) => {
  const [field, meta] = useField(props);

  return (
    <div className="relative py-1">
      <label className="font-medium text-[15px]" htmlFor={props.id || props.name}>
        {props.label}
      </label>
      <textarea
        className="py-2 px-4 w-full mt-2 rounded-md outline-none text-sm h-24 placeholder:text-xs"
        placeholder={props.placeholder}
        {...field}
      />
      {meta.touched || meta.error ? (
        <div className="absolute -bottom-3 text-error/70 text-xs">
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export const SubtaskInput = ({
  index,
  arrayHelpers,
  ...props
}: OtherProps & FieldHookConfig<string>) => {
  const [field, meta] = useField(props);

  return (
    <div className="relative w-full">
      <div className="flex gap-2 my-2 items-center">
        <Field
          {...field}
          {...props}
          className={`${
            meta.error ? " border-error/70 border-solid" : null
          } px-4 py-3 w-full text-sm placeholder:text-xs border-[1px] rounded-md outline-none`}
        />
        <button type="button" onClick={() => arrayHelpers.remove(index)}>
          <MdClose className="text-lg hover:text-primary font-bold" />
        </button>
      </div>
    </div>
  );
};

export const DisplayText = ({ label, value,style }: DisplayProps) => {
  return (
    <div className="relative py-1">
      <h3 className="font-bold text-[15px]">{label}</h3>
      <p  style={style} className="text-gray w-full leading-loose rounded-md">{value}</p>
    </div>
  );
};
