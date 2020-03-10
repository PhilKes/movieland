package com.phil.movieland.auth.jwt.entity;

import org.hibernate.annotations.NaturalId;

import javax.persistence.*;

import static com.phil.movieland.auth.jwt.entity.Role.RoleName.ROLE_ADMIN;
import static com.phil.movieland.auth.jwt.entity.Role.RoleName.ROLE_USER;

@Entity
@Table(name="ROLE")
public class Role implements Comparable<Role> {

    @Override
    public int compareTo(Role o) {
        switch(o.name) {
            case ROLE_USER:
                return name==ROLE_ADMIN ? 1 : 0;
            case ROLE_ADMIN:
                return name==ROLE_USER ? -1 : 0;
        }
        return 0;
    }

    public enum RoleName {
        ROLE_USER,
        ROLE_ADMIN,
        ROLE_CASHIER
    }

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NaturalId
    @Column(length=60)
    private RoleName name;

    public Role() {

    }

    public Role(RoleName name) {
        this.name=name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id=id;
    }

    public RoleName getName() {
        return name;
    }

    public void setName(RoleName name) {
        this.name=name;
    }


}