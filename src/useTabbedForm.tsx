import {useState} from 'react';
import {create} from 'zustand';
import {FieldValues, useForm, UseFormReturn} from 'react-hook-form';
import {ZodSchema} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

interface Tab {
    label: string;
}

interface TabbedFormStore {
    tabs: Tab[];
}

const useTabbedFormStore = (initialState: Tab[]) => create<TabbedFormStore>(() => ({
    tabs: initialState,
}));

interface UseTabbedFormProps<TFormValues> {
    initialState: Tab[],
    schema?: ZodSchema<TFormValues>
    submitForm: (formValues: TFormValues) => void;
}

function useTabbedForm<TFormValues extends FieldValues>(hookProps: UseTabbedFormProps<TFormValues>) {
    const {initialState} = hookProps;
    const [activeTab, setActiveTab] = useState(0);
    const store = useTabbedFormStore(initialState);

    const methods: UseFormReturn<TFormValues> = useForm({
        mode: 'onBlur',
        resolver: hookProps?.schema ? zodResolver(hookProps?.schema) : undefined,
    });

    const {handleSubmit, getValues} = methods;

    const handleTabChange = (index: number) => {
        setActiveTab(index);
    };

    const updateFormData = (data: TFormValues) => {
        methods.reset(data);
    };

    const onSubmit = (data: TFormValues) => {
        console.log('Form Data:', data);
        hookProps.submitForm(data);
    };

    return {
        activeTab,
        handleTabChange,
        handleSubmit: handleSubmit(onSubmit),
        formMethods: methods,
        updateFormData,
        tabs: store((state) => state.tabs),
        getValues,
    };
}

export default useTabbedForm;
