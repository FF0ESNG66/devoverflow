"use client" // we might get an error saying that the Form from reack-hook-forms doesnt exist if we dont put use client first

import { AskQuestionSchema } from '@/lib/validations'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { MDXEditorMethods } from '@mdxeditor/editor'
import dynamic from 'next/dynamic'
import { z } from "zod"
import TagCard from '../cards/TagCard'


const Editor = dynamic(() => import('@/components/editor'), {
  // Make sure we turn SSR off
  // We will use this version of import instead of manually importing the editor
  // This is to preven hydration errors
  ssr: false
})

const QuestionForm = () => {
    const editorRef = useRef<MDXEditorMethods>(null);

    const form = useForm<z.infer<typeof AskQuestionSchema>> ({
        resolver: standardSchemaResolver(AskQuestionSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: [],
        }
    });

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement> , field: {value: string[]}) => {
        if (e.key === "Enter") {
            e.preventDefault();  // Whis this we prevent to submit the whole form, we're just submitting the tag
            const tagInput = e.currentTarget.value.trim();

            if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
                form.setValue("tags", [...field.value, tagInput]);
                e.currentTarget.value = "";
                form.clearErrors("tags");

            } else if (tagInput.length > 15) {
                form.setError("tags", {
                    type: "manual",
                    message: "Tag should be less tahn 15 characters.",
                });

            } else if (field.value.includes(tagInput)) {
                form.setError("tags", {
                    type: "manual",
                    message: "Tag already exists.",
                });
            }
        }
    }

    const handletagRemove = (tag: string, field: { value: string[]}) => {
        const newTags = field.value.filter((t) => t !== tag); // This is going to give us all of the new tags without the one taht we just clicked to delete it

        form.setValue("tags", newTags);

        if(newTags.length === 0) {
            form.setError("tags", {
                type: "manual",
                message: "Tags are required",
            })
        }
    };

    const handleCreateQuestion = (data: z.infer<typeof AskQuestionSchema>) => {
        console.log(data)
    };

  return (
    // spreading the form component into the Form element
    <Form  {...form}> 
        <form 
            className='flex w-full flex-col gap-10'
            onSubmit={form.handleSubmit(handleCreateQuestion)}
        >
            <FormField
                // control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                    <FormLabel className="paragraph-semibold text-dark400_light800">
                        Question Title <span className='text-primary-500'>*</span>
                    </FormLabel>
                    <FormControl>
                        <Input
                            className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 border"
                            {...field}
                        />
                    </FormControl>
                    <FormDescription
                        className='body-regular text-light-500 mt-2.5'
                    >
                        Be specific and imagine you&apos;re asking a question to another person.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                // control={form.control}
                name="content"
                render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                    <FormLabel className="paragraph-semibold text-dark400_light800">
                        Detailed explanation of your problem {" "} <span className='text-primary-500'>*</span>
                    </FormLabel>
                    <FormControl>
                        <Editor 
                            fieldChange={field.onChange}
                            value={field.value}
                            editorRef={editorRef}
                        />
                    </FormControl>
                    <FormDescription
                        className='body-regular text-light-500 mt-2.5'
                    >
                        Introduce the problem and expand on what you&apos;ve put in the title.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                // control={form.control}
                name="tags"
                render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="paragraph-semibold text-dark400_light800">
                       Tags <span className='text-primary-500'>*</span>
                    </FormLabel>
                    <FormControl>
                        <div>
                            <Input
                                className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 border"
                                placeholder='Add tags...'
                                onKeyDown={(e) => handleInputKeyDown(e, field)}
                            />
                            {field.value.lenght > 0 && (
                                <div className='flex-start mt-2.5 flex-wrap gap-2.5'>
                                    {field?.value?.map((tag: string) => (
                                        <TagCard key={tag} _id={tag} name={tag} compact remove isButton handleRemove={() => handletagRemove(tag, field)} />
                                    ))}
                                </div>
                            )}
                            Tags
                        </div>
                    </FormControl>
                    <FormDescription
                        className='body-regular text-light-500 mt-2.5'
                    >
                        Add up to three (3) tags to describe what your question is about. You need to press enter to add a tag.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <div className='mt-16 flex justify-end'>
                <Button type="submit" className='primary-gradient text-light-900! w-fit'>
                    Ask a Question
                </Button>
            </div>
        </form>
    </Form>
  )
}

export default QuestionForm
