type tree = {
    route:string
    children:tree[]
    description: string,
}

export const routesTree:tree[] = [
    {
        route: "/login",
        description: "Login route. Allows users to login with their credentials.",
        children: []
    },
    {
        route: "/register",
        description: "Register route. Allows users to register with their credentials.",
        children: []
    },
    {
        route: "/welcome",
        description: "Lets new users set their first name, last name, and bio.",
        children: []
    },
    {
        route: "/",
        description: "Home route. Displays posts as well as a sidebar that links to other routes. Includes submit post, search for users, and display posts by following, category(s), and groups. ",
        children: [
            {
                route: "/home/categories",
                description: "Displays posts based on selected categories from the index route.",
                children: []
            },
            {
                route: "/home/groups",
                description: "Users can view posts from groups they are part of. Accessed by clicking on the groups button at the top of the index route right above the post form and selecting a group from the list of groups they will see",
                children: []
            },
            {
                route:"/following",
                description: "Displays posts from users you follow.",
                children: []
            }
        ]
    },
    {
        route:"/explore",
        description: "Displays recommended posts and users or most viewed posts for new accounts. Recommended posts are based on the user's interests which are calculated from what categories they interact with.",
        children: [
            {
                route: "/explore/posts",
                description: "Narrows down the page to posts only",
                children: []
            },
            {
                route: "/explore/user",
                description: "Narrows down the page to users only",
                children: []
            },
            {
                route: "/explore/search",
                description: "More advanced search for posts and users. Keywords are used to find posts and users that match the search query. For example, searching 'svelte' will return posts and users that have 'svelte' in their content or username.",
                children: []
            }
        ]
    },
    {
        route:"/notifications",
        description: "Displays notifications for new followers, likes, comments, and follow requests. They are sorted by unread first and then by date. Notifications are marked as read when the user views them.",
        children: [
            {
                route: "/notifications/followers",
                description: "Displays notifications for followers.",
                children: []
            },
            {
                route: "/notifications/likes",
                description: "Displays notifications for likes.",
                children: []
            },
            {
                route: "/notifications/comments",
                description: "Displays notifications for comments.",
                children: []
            },
            {
                route: "/notifications/requests",
                description: "Displays notifications for pending follow requests.",
                children: []
            }
        ]
    },
    {
        route:"/users/:username",
        description: "Displays user's profile. Includes user's posts, likes, comments, followers, following. User can also edit their profile picture from here. Posts are displayed by default. ",
        children: [
            {
                route: "/profile/likes",
                description: "Displays user's liked posts and comments.",
                children: []
            },
            {
                route: "/profile/comments",
                description: "Displays user's comments.",
                children: []
            },
        ]
    },
    {
        route:"/settings",
        description: "Allows users to change settings such as username, bio, password, delete account, privacy and so on.",
        children: [
            {
                route: "/settings/preferences",
                description: "Allows user to change between seeing media only posts, text only posts, or all posts.",
                children: []
            },
            {
                route: "/settings/profilesetting",
                description: "Allows user to change username, first name, last name, and bio.",
                children: []
            },
            {
                route: "/settings/usersetting",
                description: "Allows user to change password or delete account which is an unrecoverable action.",
                children: []
            },
            {
                route: "/settings/security",
                description: "Allows user to change between private and public profile. Private profile hides user's posts and followers from non-followers. Following has to be approved by the user.",
                children: []
            }
        ]
    },
    {
        route:"/groups",
        description: "Displays groups that the user is part of. Users can share posts to groups they're members of by clicking the 3 dots on the right side of a post and send to group. Groups are meant to be a way for users to share a post to a group of people all at once, turning it into a whole new feed. User can create a group, view groups, and manage created groups by adding or removing people and deleting groups. You can only add people to your group that you follow and they follow you back. You cannot request to join a group you must be invited by the owner.",
        children: [
            {
                route: "/groups/joined",
                description: "Displays groups that the user has been added to. Users can leave groups from here. This route does not show posts.",
                children: []
            }
        ]
    }
]