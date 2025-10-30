module.exports = {
  screens: {
    tabs: ['Home', 'Quest', 'Assistant', 'Profile'],
    quest: {
      name: 'Quest',
      sections: 10,
      howTo: [
        'Open the Quest tab from the bottom bar.',
        'Tap a Section button to jump to that section.',
        'Answer each question; use Save Section to save progress.',
        'Use Next/Back to navigate within a section.'
      ]
    },
    benefits: {
      name: 'Home',
      howTo: [
        'Use the search bar to view all programs and see eligibility indicators.',
        'Tap a benefit to view a description and why you may qualify.'
      ]
    },
    profile: {
      name: 'Profile',
      howTo: [
        'Edit your email using the pencil icon; confirm with your password.',
        'Use Change Password and Logout from this screen.'
      ]
    }
  }
}
