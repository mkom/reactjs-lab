#!/usr/bin/env node

/**
 * Feature Generator Script
 * 
 * Usage: node scripts/generate-feature.js <feature-name>
 * Example: node scripts/generate-feature.js order
 */

const fs = require('fs');
const path = require('path');

const featureName = process.argv[2];

if (!featureName) {
  console.error('Usage: node scripts/generate-feature.js <feature-name>');
  console.log('Example: node scripts/generate-feature.js order');
  process.exit(1);
}

// Convert to proper casing
const camelCase = featureName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const kebabCase = featureName.toLowerCase().replace(/\s+/g, '-');

console.log('Generating feature:', pascalCase);

const templates = {
  service: `import api from './api'
import { ENDPOINTS } from './endpoints'

export interface ${pascalCase} {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Create${pascalCase}Data {
  name: string
}

export const ${camelCase}Service = {
  getAll: async (): Promise<${pascalCase}[]> => {
    return api.get(ENDPOINTS.${pascalCase.toUpperCase()}.LIST) as Promise<${pascalCase}[]>
  },

  getById: async (id: string): Promise<${pascalCase}> => {
    return api.get(ENDPOINTS.${pascalCase.toUpperCase()}.DETAIL(id)) as Promise<${pascalCase}>
  },

  create: async (data: Create${pascalCase}Data): Promise<${pascalCase}> => {
    return api.post(ENDPOINTS.${pascalCase.toUpperCase()}.CREATE, data) as Promise<${pascalCase}>
  },

  update: async (id: string, data: Partial<Create${pascalCase}Data>): Promise<${pascalCase}> => {
    return api.put(ENDPOINTS.${pascalCase.toUpperCase()}.UPDATE(id), data) as Promise<${pascalCase}>
  },

  delete: async (id: string): Promise<void> => {
    return api.delete(ENDPOINTS.${pascalCase.toUpperCase()}.DELETE(id)) as Promise<void>
  },
}
`,

  hook: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ${camelCase}Service, type Create${pascalCase}Data } from '@/services/${camelCase}Service'

const ${pascalCase.toUpperCase()}_KEYS = {
  all: ['${camelCase}s'] as const,
  lists: () => [...${pascalCase.toUpperCase()}_KEYS.all, 'list'] as const,
  list: (filters: unknown) => [...${pascalCase.toUpperCase()}_KEYS.lists(), filters] as const,
  details: () => [...${pascalCase.toUpperCase()}_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...${pascalCase.toUpperCase()}_KEYS.details(), id] as const,
}

export const use${pascalCase}s = () => {
  return useQuery({
    queryKey: ${pascalCase.toUpperCase()}_KEYS.lists(),
    queryFn: ${camelCase}Service.getAll,
  })
}

export const use${pascalCase} = (id: string) => {
  return useQuery({
    queryKey: ${pascalCase.toUpperCase()}_KEYS.detail(id),
    queryFn: () => ${camelCase}Service.getById(id),
    enabled: !!id,
  })
}

export const useCreate${pascalCase} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ${camelCase}Service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${pascalCase.toUpperCase()}_KEYS.lists() })
    },
  })
}

export const useUpdate${pascalCase} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Create${pascalCase}Data> }) =>
      ${camelCase}Service.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ${pascalCase.toUpperCase()}_KEYS.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ${pascalCase.toUpperCase()}_KEYS.lists() })
    },
  })
}

export const useDelete${pascalCase} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ${camelCase}Service.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${pascalCase.toUpperCase()}_KEYS.lists() })
    },
  })
}
`,

  page: `import { use${pascalCase}s } from '@/hooks/use${pascalCase}'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export const ${pascalCase}ListPage = () => {
  const { data: items, isLoading } = use${pascalCase}s()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="${pascalCase}s"
        description="Manage your ${camelCase}s"
      >
        <Link to="/${kebabCase}s/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New ${pascalCase}
          </Button>
        </Link>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Add action buttons here */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
`,

  formPage: `import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { use${pascalCase}, useCreate${pascalCase}, useUpdate${pascalCase} } from '@/hooks/use${pascalCase}'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

type FormData = z.infer<typeof schema>

export const ${pascalCase}FormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const { data: item, isLoading: isLoadingItem } = use${pascalCase}(id || '')
  const createMutation = useCreate${pascalCase}()
  const updateMutation = useUpdate${pascalCase}()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item?.name || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data })
        toast.success('${pascalCase} updated successfully')
      } else {
        await createMutation.mutateAsync(data)
        toast.success('${pascalCase} created successfully')
      }
      navigate('/${kebabCase}s')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (isEditing && isLoadingItem) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit ${pascalCase}' : 'New ${pascalCase}'}
        description={isEditing ? 'Update ${camelCase} details' : 'Create a new ${camelCase}'}
      />

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/${kebabCase}s')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
`,
};

// Create files
const files = [
  { path: 'src/services/' + camelCase + 'Service.ts', content: templates.service },
  { path: 'src/hooks/use' + pascalCase + '.ts', content: templates.hook },
  { path: 'src/pages/' + pascalCase + 'ListPage.tsx', content: templates.page },
  { path: 'src/pages/' + pascalCase + 'FormPage.tsx', content: templates.formPage },
];

let createdCount = 0;

files.forEach(function(file) {
  const fullPath = path.join(process.cwd(), file.path);
  
  if (fs.existsSync(fullPath)) {
    console.log('Skipped (exists):', file.path);
    return;
  }

  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, file.content);
  console.log('Created:', file.path);
  createdCount++;
});

console.log('\nGenerated ' + createdCount + ' files for ' + pascalCase + ' feature!');
console.log('\nNext steps:');
console.log('  1. Add routes in src/routes/index.tsx');
console.log('  2. Add sidebar menu in src/components/SidebarLayout.tsx');
console.log('  3. Implement API calls in src/services/' + camelCase + 'Service.ts');
console.log('  4. Update endpoints in src/services/endpoints.ts');