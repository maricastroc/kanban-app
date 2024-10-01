import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ModalOverlay,
  ModalDescription,
  ModalTitle,
  ModalContent,
  StatusOptionsWrapper,
  SubtasksForm,
  StatusOptionsContainer,
  SelectStatusContainer,
  SubtasksWrapper
} from './styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import { Label } from '@/components/Shared/Label/styles';
import { FormContainer } from '@/components/Shared/Form';
import { InputContainer } from '@/components/Shared/InputContainer';
import { Button } from '@/components/Shared/Button';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTaskContext } from '@/contexts/TasksContext';
import { useBoardsContext } from '@/contexts/BoardsContext';
import { SubtaskProps } from '@/@types/subtask';
import { initialSubtasks } from '@/utils/getInitialValues';
import { FieldsContainer } from '@/components/Shared/FieldsContainer';
import { SubtaskField } from '@/components/SubtaskField';
import { CustomTextarea } from '@/components/Shared/TextArea';
import { CustomInput } from '@/components/Shared/Input';
import { CustomLabel } from '@/components/Shared/Label';

const subtaskSchema = z.object({
  title: z.string().min(1, { message: 'Subtask title is required' }),
  isCompleted: z.boolean().optional(),
});

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  description: z.string().optional(),
  subtasks: z.array(subtaskSchema).min(1, { message: 'At least one subtask is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
});

export type FormData = z.infer<typeof formSchema>;

interface AddTaskModalProps {
  onClose: () => void;
}

export function AddTaskModal({ onClose }: AddTaskModalProps) {
  const { activeBoard } = useBoardsContext();

  const { addTaskToColumn } = useTaskContext();

  const [openOptionsContainer, setOpenOptionsContainer] = useState(false);

  const [subtasks, setSubtasks] = useState<SubtaskProps[]>(initialSubtasks);

  const [status, setStatus] = useState(activeBoard?.columns[0]?.name)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      subtasks: initialSubtasks,
      status: 'TODO',
    },
  });

  const handleAddSubtask = () => {
    setSubtasks((prevSubtasks) => [...prevSubtasks, { title: '', isCompleted: false }]);
    setValue('subtasks', [...subtasks, { title: '', isCompleted: false }]);
  };

  const handleChangeSubtask = (index: number, newValue: string) => {
    setSubtasks((prevSubtasks) => {
      const updated = [...prevSubtasks];
      updated[index].title = newValue;
      return updated;
    });
  };

  const handleChangeStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleRemoveSubtask = (indexToRemove: number) => {
    setSubtasks((prevSubtasks) => prevSubtasks.filter((_, index) => index !== indexToRemove));
  };

  const handleAddTask = (data: FormData) => {
    const newTask = {
      title: data.title,
      description: data.description || '',
      status: status || 'Not specified',
      subtasks,
    };

    addTaskToColumn(newTask, status);
    setSubtasks(initialSubtasks);
    onClose();
  };

  useEffect(() => {
    setSubtasks(initialSubtasks);
  }, []);

  const renderSubtaskInput = (index: number, subtask: SubtaskProps) => {
    const error = errors.subtasks?.[index]?.title?.message;

    return (
      <FieldsContainer key={index}>
        <SubtaskField
          hasError={error ? true : false}
          placeholder="e.g. Make coffee"
          value={subtask.title}
          onChange={(e) => handleChangeSubtask(index, e.target.value)}
          onClick={() => handleRemoveSubtask(index)}
        />
        {error && <span>{error}</span>}
      </FieldsContainer>
    );
  };

  return (
    <Dialog.Portal>
      <ModalOverlay className="DialogOverlay" onClick={onClose} />
      <ModalContent className="DialogContent">
        <ModalTitle className="DialogTitle">Task Title</ModalTitle>
        <ModalDescription className="DialogDescription">
          <FormContainer onSubmit={handleSubmit(handleAddTask)}>
            <InputContainer>
              <CustomLabel htmlFor="title">Title</CustomLabel>
              <CustomInput hasError={errors.title ? true : false} {...register('title')} placeholder="e.g. Take coffee break" />
              {errors.title && <span>{errors.title.message}</span>}
            </InputContainer>

            <InputContainer>
              <Label htmlFor="description">Description</Label>
              <CustomTextarea
                hasError={errors.description ? true : false}
                placeholder="e.g. Task description"
                {...register('description')}
              />
              {errors.description && <span>{errors.description.message}</span>}
            </InputContainer>

            <SubtasksForm>
              <Label>Subtasks</Label>
              <SubtasksWrapper>
                {subtasks.map((subtask, index) => renderSubtaskInput(index, subtask))}
              </SubtasksWrapper>
              <Button type="button" title="+ Add New Subtask" onClick={handleAddSubtask} />
            </SubtasksForm>

            <StatusOptionsWrapper>
              <Label>Status</Label>
              <StatusOptionsContainer
                className={openOptionsContainer ? 'active' : ''}
                onClick={() => setOpenOptionsContainer((prev) => !prev)}
              >
                <p>{status}</p>
                <FontAwesomeIcon icon={openOptionsContainer ? faAngleUp : faAngleDown} />
              </StatusOptionsContainer>
              {openOptionsContainer && (
                <SelectStatusContainer>
                  {activeBoard?.columns?.map((column) => (
                    <button
                      type="button"
                      key={column.name}
                      onClick={() => handleChangeStatus(column.name)}
                    >
                      {column.name}
                    </button>
                  ))}
                </SelectStatusContainer>
              )}
              {errors.status && <span>{errors.status.message}</span>}
            </StatusOptionsWrapper>

            <Button title="Create Task" type="submit" variant="secondary" />
          </FormContainer>
        </ModalDescription>
      </ModalContent>
    </Dialog.Portal>
  );
}
