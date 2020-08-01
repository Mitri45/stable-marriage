// Function finds user by email looking
// through mentors and mentees object
// return id and type(mentor/mentee) of user


export const authenticateUser = (email, users) => {
    const mentees = users.mentees.edges
    const mentors = users.mentors.edges
    for (let i = 0; i < mentors.length; i++) {
        if (mentors[i].node.email.toLowerCase() === email) {
            let result = mentors[i].node
            result.userType = "mentor"
            return result
        } else if (mentees[i].node.email.toLowerCase() === email) {
            let result = mentees[i].node
            result.userType = "mentee"
            return result
    }
    }
// If our data lack of provided email return false
    return false
    }