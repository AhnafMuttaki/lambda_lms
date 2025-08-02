import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { toast } from 'sonner'

interface CourseSection {
  id?: string
  title: string
  order: number
}

interface CourseModule {
  id?: string
  title: string
  order: number
  sections: CourseSection[]
}

interface CourseFormData {
  title: string
  description: string
  status: 'draft' | 'pending' | 'published' | 'rejected'
  modules: CourseModule[]
}

export default function CourseCreate() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(courseId)
  
  const form = useForm<CourseFormData>({
    defaultValues: {
      title: '',
      description: '',
      status: 'draft',
      modules: []
    }
  })

  const { fields: moduleFields, append: appendModule, remove: removeModule, move: moveModule } = useFieldArray({
    control: form.control,
    name: 'modules'
  })

  const addModule = () => {
    appendModule({
      title: '',
      order: moduleFields.length,
      sections: []
    })
  }

  const addSection = (moduleIndex: number) => {
    const currentModules = form.getValues('modules')
    const currentSections = currentModules[moduleIndex].sections || []
    
    const updatedModules = [...currentModules]
    updatedModules[moduleIndex].sections = [
      ...currentSections,
      {
        title: '',
        order: currentSections.length
      }
    ]
    
    form.setValue('modules', updatedModules)
  }

  const removeSection = (moduleIndex: number, sectionIndex: number) => {
    const currentModules = form.getValues('modules')
    const updatedModules = [...currentModules]
    updatedModules[moduleIndex].sections.splice(sectionIndex, 1)
    
    // Update order for remaining sections
    updatedModules[moduleIndex].sections.forEach((section, index) => {
      section.order = index
    })
    
    form.setValue('modules', updatedModules)
  }

  const onSubmit = (data: CourseFormData) => {
    console.log('Course data:', data)
    toast.success(isEdit ? 'Course updated successfully!' : 'Course created successfully!')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? 'Edit Course' : 'Create New Course'}
          </h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Course Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: 'Course title is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter course description"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Course Modules */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Course Modules</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addModule}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Module
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {moduleFields.map((module, moduleIndex) => (
                  <Card key={module.id} className="border-muted">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <FormField
                          control={form.control}
                          name={`modules.${moduleIndex}.title`}
                          rules={{ required: 'Module title is required' }}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Module title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => addSection(moduleIndex)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeModule(moduleIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 pl-6">
                        {form.watch(`modules.${moduleIndex}.sections`)?.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="flex items-center gap-2">
                            <GripVertical className="h-3 w-3 text-muted-foreground" />
                            <Input
                              placeholder="Section title"
                              value={section.title}
                              onChange={(e) => {
                                const currentModules = form.getValues('modules')
                                const updatedModules = [...currentModules]
                                updatedModules[moduleIndex].sections[sectionIndex].title = e.target.value
                                form.setValue('modules', updatedModules)
                              }}
                              className="flex-1"
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeSection(moduleIndex, sectionIndex)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {(!form.watch(`modules.${moduleIndex}.sections`) || form.watch(`modules.${moduleIndex}.sections`).length === 0) && (
                          <p className="text-sm text-muted-foreground">No sections added yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {moduleFields.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No modules added yet. Click "Add Module" to get started.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}