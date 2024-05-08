import { FC } from 'react';
import LoadingIcon from '../../shared/components/LoadingIcon';
import useLabels from '../hooks/useLabels';

interface LabelPickerProps {
  selectedLabels: string[];
  onChange: (labelName: string) => void;
}

export const LabelPicker: FC<LabelPickerProps> = ({
  selectedLabels,
  onChange,
}) => {
  const labelsQuery = useLabels();

  if (labelsQuery.isLoading) return <LoadingIcon />; //! Por qué isLoading y no isFetching?

  return (
    <>
      {labelsQuery.data?.map((label) => (
        <span
          key={label.id}
          className={`badge rounded-pill m-1 label-picker ${
            selectedLabels.includes(label.name) ? 'labelActive' : ''
          }`}
          onClick={() => onChange(label.name)}
          style={{
            border: `1px solid #${label.color}`,
            color: `${label.color}`,
          }}
        >
          {label.name}
        </span>
      ))}
    </>
  );
};
