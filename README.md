# Course Review

## [Assignment-3](https://assignment-3-course-review-omega.vercel.app/)

## [Basic Overview with Thunder Client](https://www.youtube.com/watch?v=regWxj-0Ayc)

In this assigment we use some advanced technology. List in below:

- NodeJS
- Express
- Mongoose
- Zod
- Dotenv
- Cors
- TypeScript

In this assignment we create some api. API name and endpoint:

- Create a Course (POST /api/course)
- Get Paginated and Filtered Courses. Don’t use the query builder technique which is shown in the module. Use your own implementation for pagination & filtering. (GET /api/courses)
- Create a Category (POST /api/categories)
- Get All Categories (GET /api/categories)
- Create a Review (POST /api/reviews)
- Update a Course (Partial Update with Dynamic Update) (PUT /api/courses/:courseId)
- Get Course by ID with Reviews (GET /api/courses/:courseId/reviews)
- Get the Best Course Based on Average Review (Rating) (GET /api/course/best)

## Basic API overview

### Create a Course

This is post API. create a new course with this api.

Request Body:

```
{
  "title": "Laravel 3",
  "instructor": "Jane Doe",
  "categoryId": "65798c6de680158649e6bcfc",
  "price": 59.99,
  "tags": [
    {
      "name": "PHP",
      "isDeleted": false
    },
    {
      "name": "web development",
      "isDeleted": false
    }
  ],
  "startDate": "2023-05-15",
  "endDate": "2023-07-10",
  "language": "English",
  "provider": "Tech Academy",
  "details": {
    "level": "intermediat",
    "description": "Basic Web Development instructed by Jane Doe under the Beginner level, with a price of 49.99, categorized under Web Development and Programming"
  }
}
```

Response:

```
{
  "success": false,
  "message": "Validation Error",
  "errorMessage": "level is invalid input.",
  "errorDetails": {
    "issues": [
      {
        "code": "custom",
        "message": "Invalid input",
        "path": [
          "body",
          "details",
          "level"
        ]
      }
    ],
    "name": "ZodError"
  },
  "stack": "ZodError: [\n  {\n    \"code\": \"custom\",\n    \"message\": \"Invalid input\",\n    \"path\": [\n      \"body\",\n      \"details\",\n      \"level\"\n    ]\n  }\n]\n    at get error [as error] (/var/task/node_modules/zod/lib/types.js:43:31)\n    at ZodObject.parseAsync (/var/task/node_modules/zod/lib/types.js:166:22)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```

### Get Paginated and Filtered Courses. Don’t use the query builder technique which is shown in the module. Use your own implementation for pagination & filtering.

This API is get API. get all course with queries using this api.

Response:

```
{
  "success": true,
  "statusCode": 200,
  "message": "Courses retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 11
  },
  "data": [
    {
      "_id": "657758ad8cd117ef0e68791a",
      "title": "Basic Web Development",
      "instructor": "Jane Doe",
      "categoryId": "65771ae75e6b565d88278a5b",
      "price": 49.99,
      "tags": [
        {
          "name": "Programming",
          "isDeleted": false
        },
        {
          "name": "Web Development",
          "isDeleted": false
        }
      ],
      "startDate": "2023-01-15",
      "endDate": "2023-03-14",
      "language": "English",
      "provider": "Tech Academy",
      "durationInWeeks": 9,
      "details": {
        "level": "Beginner",
        "description": "Basic Web Development instructed by Jane Doe under the Beginner level, with a price of 49.99, categorized under Web Development and Programming"
      }
    }
  ]
}
```

### Create a Category

This is post api. Create new category with this API.

Request Body:

```
{
  "name": "JavaScript"
}
```

Response:

```
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully",
  "data": {
    "_id": "65799903c14e192b841a323c",
    "name": "PHP-2"
  }
}
```

### Get All Categories

This is get api. Get all categories with this API

Response:

```
{
  "success": true,
  "statusCode": 200,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "_id": "65771ae75e6b565d88278a5b",
      "name": "Programming"
    },
    {
      "_id": "65771b835e6b565d88278a5d",
      "name": "SEO"
    },
    {
      "_id": "65771b915e6b565d88278a5f",
      "name": "Wordpress"
    },
    {
      "_id": "65797aec1de0b3d695f72721",
      "name": "Digital Marketing"
    },
    {
      "_id": "65798a91e680158649e6bcda",
      "name": "JavaScript"
    },
    {
      "_id": "65798c6de680158649e6bcfc",
      "name": "PHP"
    },
    {
      "_id": "65799903c14e192b841a323c",
      "name": "PHP-2"
    }
  ]
}
```

### Create a Review

This is post api. Create new Review with this api

Request Body:

```
{
    "courseId": "657758ad8cd117ef0e68791a",
    "rating": 5,
    "review": "Great course!"
}
```

Response:

```
{
  "success": true,
  "statusCode": 201,
  "message": "Review created successfully",
  "data": {
    "_id": "6579a15e90e4b7a0440ebe01",
    "courseId": "657758ad8cd117ef0e68791a",
    "rating": 5,
    "review": "Great course!"
  }
}
```

### Update a Course (Partial Update with Dynamic Update)

This is put api. In this API we will updating course data Primitive and Non-Primitive both.

- Primitive Type:
  Request Body:

```
{
  "price": 30
}
```

Response:

```
{
  "success": true,
  "statusCode": 200,
  "message": "Course updated successfully",
  "data": {
    "_id": "6578257dfa18301cd588da37",
    "title": "SEO",
    "instructor": "Jane Doe",
    "categoryId": "65771b835e6b565d88278a5d",
    "price": 30,
    "tags": [
      {
        "name": "SEO",
        "isDeleted": false
      },
      {
        "name": "Digital Marketing",
        "isDeleted": false
      }
    ],
    "startDate": "2023-01-15",
    "endDate": "2023-03-14",
    "language": "English",
    "provider": "Tech Academy",
    "durationInWeeks": 9,
    "details": {
      "level": "Beginner",
      "description": "Basic Web Development instructed by Jane Doe under the Beginner level, with a price of 49.99, categorized under Web Development and Programming."
    }
  }
}
```

- Non-Primitive: (Details)

Request Body:

```
{
  "details": {
    "description": "Basic Web Development instructed by Jane Doe under the Beginner level, with a price of 49.99, categorized under Web Development and Programming..."
  }
}
```

Response:

```
{
  "success": true,
  "statusCode": 200,
  "message": "Course updated successfully",
  "data": {
    "_id": "6578257dfa18301cd588da37",
    "title": "SEO",
    "instructor": "Jane Doe",
    "categoryId": "65771b835e6b565d88278a5d",
    "price": 30,
    "tags": [
      {
        "name": "SEO",
        "isDeleted": false
      },
      {
        "name": "Digital Marketing",
        "isDeleted": false
      },
      {
        "name": "SEO Update 2",
        "isDeleted": false
      }
    ],
    "startDate": "2023-01-15",
    "endDate": "2023-03-14",
    "language": "English",
    "provider": "Tech Academy",
    "durationInWeeks": 9,
    "details": {
      "level": "Beginner",
      "description": "Basic Web Development instructed by Jane Doe under the Beginner level, with a price of 49.99, categorized under Web Development and Programming..."
    }
  }
}
```

- Non-Primitive: (Tags)

Request Body:

```
{
  "tags": [
      {
        "name": "SEO Update",
        "isDeleted": true
      },
      {
        "name": "SEO Update 2",
        "isDeleted": false
      }
    ]
}
```

Response:

```
{
  "success": true,
  "statusCode": 200,
  "message": "Course updated successfully",
  "data": {
    "_id": "6578257dfa18301cd588da37",
    "title": "SEO",
    "instructor": "Jane Doe",
    "categoryId": "65771b835e6b565d88278a5d",
    "price": 30,
    "tags": [
      {
        "name": "SEO",
        "isDeleted": false
      },
      {
        "name": "Digital Marketing",
        "isDeleted": false
      },
      {
        "name": "SEO Update 2",
        "isDeleted": false
      }
    ],
    "startDate": "2023-01-15",
    "endDate": "2023-03-14",
    "language": "English",
    "provider": "Tech Academy",
    "durationInWeeks": 9,
    "details": {
      "level": "Beginner",
      "description": "Basic Web Development instructed by Jane Doe under the Beginner level, with a price of 49.99, categorized under Web Development and Programming."
    }
  }
}
```

### Get Course by ID with Reviews

This api method is get. In this api we will find course using \_id and also find course review using courseId in reviews collection.

Response:

```
{
  "success": true,
  "statusCode": 200,
  "message": "Course and Reviews retrieved successfully",
  "data": {
    "course": {
      "_id": "6578257dfa18301cd588da37",
      "title": "SEO",
      "instructor": "Jane Doe",
      "categoryId": "65771b835e6b565d88278a5d",
      "price": 30,
      "tags": [
        {
          "name": "SEO",
          "isDeleted": false
        },
        {
          "name": "Digital Marketing",
          "isDeleted": false
        },
        {
          "name": "SEO Update 2",
          "isDeleted": false
        }
      ],
      "startDate": "2023-01-15",
      "endDate": "2023-03-14",
      "language": "English",
      "provider": "Tech Academy",
      "durationInWeeks": 9,
      "details": {
        "level": "Beginner",
        "description": "Basic Web Development instructed by Jane Doe under the Beginner level, with a price of 49.99, categorized under Web Development and Programming..."
      },
      "reviews": [
        {
          "courseId": "6578257dfa18301cd588da37",
          "rating": 4,
          "review": "Great course!"
        },
        {
          "courseId": "6578257dfa18301cd588da37",
          "rating": 4,
          "review": "Great course!"
        },
        {
          "courseId": "6578257dfa18301cd588da37",
          "rating": 4,
          "review": "Great course!"
        },
        {
          "courseId": "6578257dfa18301cd588da37",
          "rating": 4,
          "review": "Great course!"
        },
        {
          "courseId": "6578257dfa18301cd588da37",
          "rating": 4,
          "review": "Great course!"
        },
        {
          "courseId": "6578257dfa18301cd588da37",
          "rating": 4,
          "review": "Great course!"
        },
        {
          "courseId": "6578257dfa18301cd588da37",
          "rating": 4,
          "review": "Great course!"
        },
        {
          "courseId": "6578257dfa18301cd588da37",
          "rating": 3,
          "review": "Great course!"
        }
      ]
    }
  }
}
```

### Get the Best Course Based on Average Review (Rating)

This api method is get. In this api we will find best rated course. We are calculate average rating of all course and return the best rated course.

Response:

```
{
  "success": true,
  "statusCode": 200,
  "message": "Best course retrieved successfully",
  "data": {
    "course": {
      "_id": "6578257dfa18301cd588da37",
      "title": "SEO",
      "instructor": "Jane Doe",
      "categoryId": "65771b835e6b565d88278a5d",
      "price": 30,
      "tags": [
        {
          "name": "SEO",
          "isDeleted": false
        },
        {
          "name": "Digital Marketing",
          "isDeleted": false
        },
        {
          "name": "SEO Update 2",
          "isDeleted": false
        }
      ],
      "startDate": "2023-01-15",
      "endDate": "2023-03-14",
      "language": "English",
      "provider": "Tech Academy",
      "durationInWeeks": 9,
      "details": {
        "level": "Beginner",
        "description": "Basic Web Development instructed by Jane Doe under the Beginner level, with a price of 49.99, categorized under Web Development and Programming..."
      }
    },
    "averageRating": 3.875,
    "reviewCount": 8
  }
}
```

## How to run the application locally?

If you need to run this application locally so follow this process.

Clone this application from GitHub. using this code:

`git clone https://github.com/inzamulhaque/mongoose-assignment2-apollo-level2.git`  
Or  
`git clone git@github.com:inzamulhaque/mongoose-assignment2-apollo-level2.git`

If applications are cloned successfully applications open with VSCode or author text editor. Open the terminal or command prompt at this project. Install all necessary dependencies.  
For installing all dependencies run this command:  
` npm install`

run application in a development environment:  
`npm run dev`

for build production level application please run the command  
` npm run build`

for check production level build run the command  
`npm start`

### Thank you
