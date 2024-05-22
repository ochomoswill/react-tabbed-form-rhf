import React from 'react';
import {useFormContext, FormProvider} from 'react-hook-form';
import {z} from "zod";
import useTabbedForm from './useTabbedForm';
import './TabbedForm.css';


const FormSchema = z.object({
    tab0: z.object({
        field1: z.string().trim().min(1, 'Field 1 is required'),
        field2: z.string(),
        select: z.string().trim().min(1, 'Select is required'),
        checkbox: z.boolean().refine(val => val, 'Checkbox is required'),
    }),
    tab1: z.object({
        field1: z.string().trim().min(1, 'Field 1 is required'),
        field2: z.string().trim().min(1, 'Field 2 is required'),
        select: z.string().trim().min(1, 'Select is required'),
        checkbox: z.boolean().refine(val => val, 'Checkbox is required'),
    }),
});

type FormValues = z.infer<typeof FormSchema>

const initialTabs = [
    { label: 'Tab 1'},
    { label: 'Tab 2' },
];

const TabbedForm: React.FC = () => {

    const {
        activeTab,
        handleTabChange,
        handleSubmit,
        formMethods,
        updateFormData,
        tabs,
    } = useTabbedForm({
        initialState: initialTabs,
        schema: FormSchema,
        submitForm: (data) => {
            console.log('Post to API ', data);
        },
    });

    console.log("@formState errors", formMethods.formState.errors)

    return (
        <FormProvider {...formMethods}>
            <div>
                <div className="tab-header">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => handleTabChange(index)}
                            className={`${formMethods.formState.errors?.[`tab${index}`] ? 'error' : ''} ${activeTab === index ? 'active' : ''}`}
                        >
                            {tab.label}
                            {formMethods.formState.errors?.[`tab${index}`] && <span className="error-indicator"></span>}
                        </button>
                    ))}
                </div>
                <form onSubmit={handleSubmit}>
                    {tabs.map((_, index) => (
                        <div key={index} style={{ display: activeTab === index ? 'block' : 'none' }}>
                            <TabContent index={index} />
                        </div>
                    ))}
                    <button type="submit">Submit</button>
                </form>
                <button type="button" onClick={() => updateFormData(getSampleData())}>Load Sample Data</button>
            </div>
        </FormProvider>
    );
};

interface TabContentProps {
    index: number;
}

const TabContent: React.FC<TabContentProps> = ({ index }) => {
    const { register, formState: { errors } } = useFormContext<FormValues>();

    const tabErrors = errors?.[`tab${index}`];

    return (
        <div>
            <label>
                Field 1 for Tab {index + 1}
                <input
                    className={tabErrors?.field1 ? 'error' : ''}
                    {...register(`tab${index}.field1`)}
                />
            </label>
            {tabErrors?.field1 && (
                <p>{tabErrors?.field1?.message}</p>
            )}

            <label>
                Field 2 for Tab {index + 1}
                <input
                    className={tabErrors?.field2 ? 'error' : ''}
                    {...register(`tab${index}.field2`)}
                />
            </label>
            {tabErrors?.field2 && (
                <p>{tabErrors?.field2?.message}</p>
            )}

            <label>
                Select for Tab {index + 1}
                <select
                    className={tabErrors?.select ? 'error' : ''}
                    {...register(`tab${index}.select`)}
                >
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                </select>
            </label>
            {tabErrors?.select && (
                <p>{tabErrors?.select?.message}</p>
            )}

            <label>
                Checkbox for Tab {index + 1}
                <input
                    type="checkbox"
                    className={tabErrors?.checkbox ? 'error' : ''}
                    {...register(`tab${index}.checkbox`)}
                />
            </label>
            {tabErrors?.checkbox && (
                <p>{tabErrors?.checkbox?.message}</p>
            )}
        </div>
    );
};

const getSampleData = (): FormValues => ({
    tab0: { field1: 'Sample Data 1', field2: 'Sample Data 2', select: 'option1', checkbox: true },
    tab1: { field1: 'Sample Data 3', field2: 'Sample Data 4', select: 'option2', checkbox: false },
});

export default TabbedForm;
