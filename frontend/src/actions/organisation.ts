'use server'


interface OrganisationState {
  name: string
  imageUrl: string
  description: string
  status?: number
  message?: string
}

export async function createOrganisation(
  prevState: OrganisationState,
  formData: FormData
): Promise<OrganisationState> {
  try {
    // Get form data
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const imageUrl = formData.get('imageUrl') as string

    // Validate form data
    if (!name || !description || !imageUrl) {
      return {
        ...prevState,
        status: 400,
        message: 'All fields are required'
      }
    }

    // Return success state to trigger smart contract interaction
    return {
      name,
      description,
      imageUrl,
      status: 0, // Status 0 indicates success and triggers smart contract interaction
      message: 'Form validated successfully'
    }

  } catch (error) {
    console.error('Error creating organisation:', error)
    return {
      ...prevState,
      status: 500,
      message: 'Something went wrong creating the organisation'
    }
  }
}