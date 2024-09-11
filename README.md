# Description
This project is a sample web based chat app, developed with Nextjs/typescript/mysql/redis.
This project was purely for learning purposes.
I plan to come back to this after learning docker and kubernetes to try setting up a server system similar to discord.

### MySQL database config:
```sql
    CREATE TABLE blocked_users (
        id INT(11) NOT NULL AUTO_INCREMENT,
        blocker_id INT(11) NOT NULL,
        blocked_id INT(11) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        PRIMARY KEY (id),
        KEY (blocker_id)
    ) ENGINE=InnoDB;

    CREATE TABLE friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE friend_requests (
    id INT(11) NOT NULL AUTO_INCREMENT,
    sender_id INT(11) NOT NULL,
    receiver_id INT(11) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    PRIMARY KEY (id),
    KEY (sender_id)
    );

    CREATE TABLE messages (
    id INT(11) NOT NULL AUTO_INCREMENT,
    sender_id INT(11) NOT NULL,
    receiver_id INT(11) NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('read', 'unread') NOT NULL DEFAULT 'unread',
    PRIMARY KEY (id)
    );

    CREATE TABLE users (
    UserID INT(11) NOT NULL AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar VARCHAR(255),
    phone VARCHAR(20),
    banner VARCHAR(255),
    notifAudio TINYINT(1) DEFAULT 1,
    PRIMARY KEY (UserID),
    UNIQUE KEY (Username),
    UNIQUE KEY (Email)
    );

    CREATE TABLE user_preferences (
    id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11) NOT NULL,
    theme ENUM('dark', 'light') NOT NULL,
    PRIMARY KEY (id)
    );
```

